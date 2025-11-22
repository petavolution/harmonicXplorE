/**
 * NeuroNetManager.js
 * 
 * Neural network implementation using EventGear instances as neurons.
 * This manager handles model configuration, neuron setup, and processing.
 */

export default class NeuroNetManager {
  /**
   * Creates a new NeuroNetManager instance
   * @param {EventGear} eventGear - Main EventGear instance for integration with app
   * @param {Object} options - Configuration options
   */
  constructor(eventGear, options = {}) {
    this.mainEventGear = eventGear;
    
    // Configuration for the neural network
    this.options = {
      numberOfNeurons: options.numberOfNeurons || 5,
      bufferSize: options.bufferSize || 1000,
      learningRate: options.learningRate || 0.01,
      activationFunction: options.activationFunction || 'relu',
      ...options
    };
    
    // Store neuron processors (EventGear instances)
    this.neurons = [];
    
    // Model configurations
    this.modelConfigs = {};
    
    // Current active model
    this.activeModel = null;
    
    // Network state
    this.isProcessing = false;
    this.inputBuffer = [];
    this.outputBuffer = [];
    this.processingStats = {
      inferenceCount: 0,
      averageProcessingTime: 0,
      lastProcessingTime: 0,
      startTime: 0
    };
    
    // Register with main EventGear
    this.registerWithMainEventGear();
    
    console.log(`NeuroNetManager initialized with ${this.options.numberOfNeurons} neurons`);
  }
  
  /**
   * Registers network events with the main EventGear instance
   */
  registerWithMainEventGear() {
    // Update metadata to include neural net info
    const metadata = this.mainEventGear.getMetadata() || {};
    
    this.mainEventGear.setMetadata({
      ...metadata,
      neuroNet: {
        initialized: true,
        numberOfNeurons: this.options.numberOfNeurons,
        bufferSize: this.options.bufferSize,
        activationFunction: this.options.activationFunction,
        models: Object.keys(this.modelConfigs),
        activeModel: this.activeModel,
        isProcessing: this.isProcessing
      }
    });
    
    // Listen for neural net related events
    this.mainEventGear.on('neuroNet.input', (data) => this.processInput(data));
    this.mainEventGear.on('neuroNet.loadModel', (data) => this.loadModel(data.name, data.config));
    this.mainEventGear.on('neuroNet.activateModel', (data) => this.activateModel(data.name));
    
    // Register initialization event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.initialized',
      config: this.options,
      timestamp: performance.now()
    });
  }
  
  /**
   * Initializes the neuron processors
   */
  initializeNeurons() {
    if (this.neurons.length > 0) {
      // Clean up existing neurons if any
      this.disposeNeurons();
    }
    
    // Create EventGear instances for each neuron
    for (let i = 0; i < this.options.numberOfNeurons; i++) {
      const neuronProcessor = new EventGear(this.options.bufferSize);
      
      // Configure this EventGear instance
      neuronProcessor.setMetadata({
        neuronIndex: i,
        weights: [],
        bias: 0,
        lastActivation: 0,
        connections: {
          inputs: [],
          outputs: []
        }
      });
      
      this.neurons.push(neuronProcessor);
    }
    
    console.log(`${this.neurons.length} neuron processors initialized`);
    
    // Register neuron initialization event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.neuronsInitialized',
      count: this.neurons.length,
      timestamp: performance.now()
    });
  }
  
  /**
   * Sets up the network based on the active model configuration
   */
  setupNetwork() {
    if (!this.activeModel || !this.modelConfigs[this.activeModel]) {
      console.error('Cannot setup network: No active model selected');
      return;
    }
    
    // Initialize neurons if not already done
    if (this.neurons.length === 0) {
      this.initializeNeurons();
    }
    
    const config = this.modelConfigs[this.activeModel];
    
    // Configure each neuron based on the model
    this.neurons.forEach((neuron, index) => {
      const neuronConfig = config.neurons[index] || {
        weights: [0.5, 0.3, 0.2],
        bias: 0.1,
        connections: { inputs: [], outputs: [] }
      };
      
      // Set the neuron's configuration
      neuron.setMetadata({
        ...neuron.getMetadata(),
        weights: neuronConfig.weights,
        bias: neuronConfig.bias,
        connections: neuronConfig.connections
      });
      
      // Set up callbacks for processing
      this.setupNeuronCallbacks(neuron, index);
    });
    
    // Register network setup event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.networkSetup',
      model: this.activeModel,
      timestamp: performance.now()
    });
    
    console.log(`Neural network setup complete with model: ${this.activeModel}`);
  }
  
  /**
   * Sets up callbacks for neuron processing
   * @param {EventGear} neuron - The neuron processor
   * @param {number} index - Index of the neuron
   */
  setupNeuronCallbacks(neuron, index) {
    // Callback for when neuron receives input data
    neuron.setCallbackMetadataChange((key, oldValue, newValue) => {
      if (key === 'inputValues' && newValue) {
        const metadata = neuron.getMetadata();
        const weights = metadata.weights || [];
        const bias = metadata.bias || 0;
        const inputValues = newValue;
        
        // Calculate weighted sum
        let weightedSum = bias;
        for (let i = 0; i < inputValues.length && i < weights.length; i++) {
          weightedSum += inputValues[i] * weights[i];
        }
        
        // Apply activation function
        const activationValue = this.applyActivation(weightedSum);
        
        // Update neuron's activation
        neuron.setMetadata({
          ...metadata,
          lastActivation: activationValue,
          lastProcessingTime: performance.now()
        });
        
        // Forward to connected neurons
        this.forwardToConnectedNeurons(index, activationValue);
        
        // If this is an output neuron, store the result
        if (metadata.connections.outputs.length === 0) {
          this.recordOutput(index, activationValue);
        }
      }
    });
    
    // Register callback setup
    this.mainEventGear.registerEvent({
      type: 'neuroNet.neuronCallbackSetup',
      neuronIndex: index,
      timestamp: performance.now()
    });
  }
  
  /**
   * Forwards activation to connected neurons
   * @param {number} sourceIndex - Index of the source neuron
   * @param {number} activationValue - Activation value to forward
   */
  forwardToConnectedNeurons(sourceIndex, activationValue) {
    const sourceNeuron = this.neurons[sourceIndex];
    if (!sourceNeuron) return;
    
    const metadata = sourceNeuron.getMetadata();
    const connections = metadata.connections.outputs || [];
    
    // Forward to each connected neuron
    connections.forEach(targetIndex => {
      if (targetIndex >= 0 && targetIndex < this.neurons.length) {
        const targetNeuron = this.neurons[targetIndex];
        const targetMetadata = targetNeuron.getMetadata();
        
        // Get current input values or initialize empty array
        const currentInputs = targetMetadata.inputValues || [];
        
        // Add this activation to the input buffer at the right position
        const inputPosition = targetMetadata.connections.inputs.indexOf(sourceIndex);
        if (inputPosition >= 0) {
          const newInputs = [...currentInputs];
          newInputs[inputPosition] = activationValue;
          
          // Update target neuron's inputs
          targetNeuron.setMetadata({
            ...targetMetadata,
            inputValues: newInputs
          });
          
          // Register forward propagation event
          this.mainEventGear.registerEvent({
            type: 'neuroNet.forwardPropagation',
            from: sourceIndex,
            to: targetIndex,
            value: activationValue,
            timestamp: performance.now()
          });
        }
      }
    });
  }
  
  /**
   * Records output from output neurons
   * @param {number} neuronIndex - Index of the output neuron
   * @param {number} value - Output value
   */
  recordOutput(neuronIndex, value) {
    this.outputBuffer.push({
      neuronIndex,
      value,
      timestamp: performance.now()
    });
    
    // If this completes a full output set, emit the result
    if (this.outputBuffer.length >= this.getOutputNeuronCount()) {
      this.emitNetworkOutput();
    }
  }
  
  /**
   * Gets the count of output neurons in the current model
   * @returns {number} - Number of output neurons
   */
  getOutputNeuronCount() {
    if (!this.activeModel || !this.modelConfigs[this.activeModel]) {
      return 0;
    }
    
    const config = this.modelConfigs[this.activeModel];
    return config.outputNeurons?.length || 0;
  }
  
  /**
   * Emits the final output of the network
   */
  emitNetworkOutput() {
    // Calculate processing time
    const processingTime = performance.now() - this.processingStats.startTime;
    
    // Update processing stats
    this.processingStats.inferenceCount++;
    this.processingStats.lastProcessingTime = processingTime;
    this.processingStats.averageProcessingTime = 
      ((this.processingStats.averageProcessingTime * (this.processingStats.inferenceCount - 1)) + processingTime) / 
      this.processingStats.inferenceCount;
    
    // Sort outputs by neuron index
    const sortedOutputs = [...this.outputBuffer].sort((a, b) => a.neuronIndex - b.neuronIndex);
    const outputValues = sortedOutputs.map(o => o.value);
    
    // Set processing state
    this.isProcessing = false;
    
    // Update metadata
    const metadata = this.mainEventGear.getMetadata() || {};
    const neuroNetMetadata = metadata.neuroNet || {};
    
    this.mainEventGear.setMetadata({
      ...metadata,
      neuroNet: {
        ...neuroNetMetadata,
        isProcessing: false,
        lastOutput: outputValues,
        processingStats: { ...this.processingStats }
      }
    });
    
    // Emit output event
    this.mainEventGear.emit('neuroNet.output', {
      values: outputValues,
      processingTime,
      model: this.activeModel,
      timestamp: performance.now()
    });
    
    // Register output event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.outputGenerated',
      output: outputValues,
      processingTime,
      timestamp: performance.now()
    });
    
    // Clear output buffer
    this.outputBuffer = [];
    
    console.log(`Neural network output generated: [${outputValues.join(', ')}]`);
  }
  
  /**
   * Applies the activation function to a value
   * @param {number} x - Input value
   * @returns {number} - Activated value
   */
  applyActivation(x) {
    switch (this.options.activationFunction.toLowerCase()) {
      case 'relu':
        return Math.max(0, x);
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'tanh':
        return Math.tanh(x);
      case 'leaky_relu':
        return x > 0 ? x : 0.01 * x;
      default:
        return x;
    }
  }
  
  /**
   * Processes input through the neural network
   * @param {Object} data - Input data
   */
  processInput(data) {
    if (!this.activeModel || !this.modelConfigs[this.activeModel]) {
      console.error('Cannot process input: No active model selected');
      return;
    }
    
    if (this.isProcessing) {
      // If already processing, add to input buffer for later
      this.inputBuffer.push(data);
      return;
    }
    
    // Start processing
    this.isProcessing = true;
    this.processingStats.startTime = performance.now();
    
    // Update metadata
    const metadata = this.mainEventGear.getMetadata() || {};
    const neuroNetMetadata = metadata.neuroNet || {};
    
    this.mainEventGear.setMetadata({
      ...metadata,
      neuroNet: {
        ...neuroNetMetadata,
        isProcessing: true,
        currentInput: data.values
      }
    });
    
    // Register input event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.inputReceived',
      input: data.values,
      timestamp: performance.now()
    });
    
    // Get input neurons from model config
    const config = this.modelConfigs[this.activeModel];
    const inputNeurons = config.inputNeurons || [0];
    
    // Distribute input to input neurons
    inputNeurons.forEach((neuronIndex, i) => {
      if (neuronIndex >= 0 && neuronIndex < this.neurons.length) {
        const inputValue = data.values[i] !== undefined ? data.values[i] : 0;
        const neuron = this.neurons[neuronIndex];
        const metadata = neuron.getMetadata();
        
        // Set the input value directly for input neurons
        neuron.setMetadata({
          ...metadata,
          lastActivation: inputValue,
          inputValues: [inputValue]
        });
        
        // Forward this activation to connected neurons
        this.forwardToConnectedNeurons(neuronIndex, inputValue);
      }
    });
  }
  
  /**
   * Loads a model configuration
   * @param {string} name - Name of the model
   * @param {Object} config - Model configuration
   */
  loadModel(name, config) {
    this.modelConfigs[name] = config;
    
    // Update metadata
    const metadata = this.mainEventGear.getMetadata() || {};
    const neuroNetMetadata = metadata.neuroNet || {};
    
    this.mainEventGear.setMetadata({
      ...metadata,
      neuroNet: {
        ...neuroNetMetadata,
        models: Object.keys(this.modelConfigs)
      }
    });
    
    // Register model loaded event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.modelLoaded',
      name,
      timestamp: performance.now()
    });
    
    console.log(`Neural network model loaded: ${name}`);
    
    // If no active model, activate this one
    if (!this.activeModel) {
      this.activateModel(name);
    }
  }
  
  /**
   * Activates a model for processing
   * @param {string} name - Name of the model to activate
   */
  activateModel(name) {
    if (!this.modelConfigs[name]) {
      console.error(`Model not found: ${name}`);
      return;
    }
    
    this.activeModel = name;
    
    // Update metadata
    const metadata = this.mainEventGear.getMetadata() || {};
    const neuroNetMetadata = metadata.neuroNet || {};
    
    this.mainEventGear.setMetadata({
      ...metadata,
      neuroNet: {
        ...neuroNetMetadata,
        activeModel: name
      }
    });
    
    // Register model activation event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.modelActivated',
      name,
      timestamp: performance.now()
    });
    
    // Setup the network with this model
    this.setupNetwork();
    
    console.log(`Neural network model activated: ${name}`);
  }
  
  /**
   * Loads a simple feedforward model for testing
   */
  loadSimpleFeedforwardModel() {
    // Define a simple feedforward model with 3 layers
    const simpleModel = {
      description: 'Simple feedforward neural network with 2 inputs, 3 hidden, 1 output',
      inputNeurons: [0, 1],    // Indices of the input neurons
      outputNeurons: [6],      // Indices of the output neurons
      neurons: [
        // Input layer (2 neurons)
        {
          weights: [1],
          bias: 0,
          connections: { inputs: [], outputs: [2, 3, 4] }
        },
        {
          weights: [1],
          bias: 0,
          connections: { inputs: [], outputs: [2, 3, 4] }
        },
        
        // Hidden layer (3 neurons)
        {
          weights: [0.5, 0.5],
          bias: 0.1,
          connections: { inputs: [0, 1], outputs: [5, 6] }
        },
        {
          weights: [0.3, 0.7],
          bias: -0.1,
          connections: { inputs: [0, 1], outputs: [5, 6] }
        },
        {
          weights: [0.8, 0.2],
          bias: 0.05,
          connections: { inputs: [0, 1], outputs: [5, 6] }
        },
        
        // Output layer (2 neurons)
        {
          weights: [0.4, 0.6, 0.5],
          bias: 0.2,
          connections: { inputs: [2, 3, 4], outputs: [] }
        },
        {
          weights: [0.7, 0.3, 0.2],
          bias: -0.1,
          connections: { inputs: [2, 3, 4], outputs: [] }
        }
      ]
    };
    
    this.loadModel('simpleFeedforward', simpleModel);
  }
  
  /**
   * Creates a basic model for harmonics analysis
   */
  loadHarmonicsAnalysisModel() {
    // Define a model specifically for analyzing harmonic relationships
    const harmonicsModel = {
      description: 'Harmonic relationship analysis network',
      inputNeurons: [0, 1, 2, 3],  // For frequency ratios / harmonic values
      outputNeurons: [8, 9],       // Output predictions (resonance score, tension score)
      neurons: [
        // Input layer (4 neurons for harmonic inputs)
        { weights: [1], bias: 0, connections: { inputs: [], outputs: [4, 5, 6] } },
        { weights: [1], bias: 0, connections: { inputs: [], outputs: [4, 5, 6] } },
        { weights: [1], bias: 0, connections: { inputs: [], outputs: [4, 5, 6] } },
        { weights: [1], bias: 0, connections: { inputs: [], outputs: [4, 5, 6] } },
        
        // Hidden layer 1 (3 neurons)
        {
          weights: [0.25, 0.25, 0.25, 0.25],
          bias: 0,
          connections: { inputs: [0, 1, 2, 3], outputs: [7, 8] }
        },
        {
          weights: [0.4, 0.3, 0.2, 0.1],
          bias: 0.1,
          connections: { inputs: [0, 1, 2, 3], outputs: [7, 9] }
        },
        {
          weights: [0.1, 0.2, 0.3, 0.4],
          bias: -0.1,
          connections: { inputs: [0, 1, 2, 3], outputs: [7, 8, 9] }
        },
        
        // Hidden layer 2 (1 neuron)
        {
          weights: [0.33, 0.33, 0.34],
          bias: 0.2,
          connections: { inputs: [4, 5, 6], outputs: [8, 9] }
        },
        
        // Output layer (2 neurons - resonance and tension scores)
        {
          weights: [0.5, 0.3, 0.2],
          bias: 0.1,
          connections: { inputs: [4, 6, 7], outputs: [] }
        },
        {
          weights: [0.2, 0.5, 0.3],
          bias: -0.1,
          connections: { inputs: [5, 6, 7], outputs: [] }
        }
      ]
    };
    
    this.loadModel('harmonicsAnalysis', harmonicsModel);
  }
  
  /**
   * Processes harmonic series data to get insight
   * @param {Array} harmonicSeries - Array of harmonic values
   * @returns {Promise} - Promise resolving to analysis result
   */
  analyzeHarmonicSeries(harmonicSeries) {
    return new Promise((resolve) => {
      // Ensure harmonics analysis model is loaded
      if (!this.modelConfigs['harmonicsAnalysis']) {
        this.loadHarmonicsAnalysisModel();
      }
      
      // Activate the model if not already active
      if (this.activeModel !== 'harmonicsAnalysis') {
        this.activateModel('harmonicsAnalysis');
      }
      
      // Function to handle the output
      const handleOutput = (data) => {
        // Remove the listener so it doesn't fire again
        this.mainEventGear.off('neuroNet.output', handleOutput);
        
        const [resonanceScore, tensionScore] = data.values;
        
        // Create analysis result
        const result = {
          resonanceScore,
          tensionScore,
          harmonicQuality: resonanceScore > tensionScore ? 'harmonic' : 'dissonant',
          strength: Math.max(resonanceScore, tensionScore),
          processingTime: data.processingTime
        };
        
        resolve(result);
      };
      
      // Listen for output
      this.mainEventGear.on('neuroNet.output', handleOutput);
      
      // Process input (take first 4 values or pad with zeros)
      const inputValues = [...harmonicSeries.slice(0, 4)];
      while (inputValues.length < 4) {
        inputValues.push(0);
      }
      
      // Send input for processing
      this.mainEventGear.emit('neuroNet.input', {
        values: inputValues,
        source: 'harmonicSeriesAnalysis',
        timestamp: performance.now()
      });
    });
  }
  
  /**
   * Cleans up resources when the manager is no longer needed
   */
  dispose() {
    // Clean up neuron processors
    this.disposeNeurons();
    
    // Remove event listeners
    this.mainEventGear.off('neuroNet.input');
    this.mainEventGear.off('neuroNet.loadModel');
    this.mainEventGear.off('neuroNet.activateModel');
    
    // Register disposal event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.disposed',
      timestamp: performance.now()
    });
    
    console.log('NeuroNetManager disposed');
  }
  
  /**
   * Disposes neuron processors
   */
  disposeNeurons() {
    // Clean up callback references for each neuron
    this.neurons.forEach(neuron => {
      if (typeof neuron.setCallbackMetadataChange === 'function') {
        neuron.setCallbackMetadataChange(null);
      }
    });
    
    // Clear neuron array
    this.neurons = [];
    
    // Register neuron disposal event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.neuronsDisposed',
      timestamp: performance.now()
    });
  }
  
  /**
   * Initializes neural network with default models
   */
  initialize() {
    // Initialize neurons
    this.initializeNeurons();
    
    // Load default models
    this.loadSimpleFeedforwardModel();
    this.loadHarmonicsAnalysisModel();
    
    // Register initialization complete event
    this.mainEventGear.registerEvent({
      type: 'neuroNet.initializationComplete',
      timestamp: performance.now()
    });
    
    console.log('NeuroNetManager initialization complete');
    
    return this;
  }
} 