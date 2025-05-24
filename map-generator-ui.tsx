import React, { useState, useRef } from 'react';
import { Search, Palette, MapPin, Download, Eye, EyeOff, Settings, Info } from 'lucide-react';

const MapGeneratorUI = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [confirmedCity, setConfirmedCity] = useState(null);
  const [loadWater, setLoadWater] = useState(true);
  const [loadBuildings, setLoadBuildings] = useState(true);
  const [selectedPalette, setSelectedPalette] = useState('Liverpool Official');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Palette definitions
  const palettes = {
    "Liverpool Official": { 
      bg: "#b4d4c0", 
      water: "#005b8a", 
      building: "#6a6050", 
      motorway: "#de006a",
      primary: "#7c3c7c",
      secondary: "#e0c74f",
      local: "#e0c74f"
    },
    "Monochrome Dark": { 
      bg: "#222222", 
      water: "#4A90E2", 
      building: "#444444", 
      motorway: "#FFFFFF",
      primary: "#BBBBBB",
      secondary: "#888888",
      local: "#555555"
    },
    "Blueprint": { 
      bg: "#FFFFFF", 
      water: "#A8D8F0", 
      building: "#D0E0E3", 
      motorway: "#003366",
      primary: "#005A9C",
      secondary: "#3E84B3",
      local: "#7BAFD4"
    },
    "Vintage Paper": { 
      bg: "#F5EFE6", 
      water: "#A9C7D9", 
      building: "#E0D6C8", 
      motorway: "#5D4037",
      primary: "#795548",
      secondary: "#A1887F",
      local: "#D7CCC8"
    }
  };

  // Layer settings
  const [layerSettings, setLayerSettings] = useState({
    water: { enabled: true, opacity: 1.0, color: palettes[selectedPalette].water },
    building: { enabled: true, opacity: 0.85, color: palettes[selectedPalette].building },
    motorway: { enabled: true, opacity: 1.0, thickness: 1.0, color: palettes[selectedPalette].motorway },
    primary: { enabled: true, opacity: 1.0, thickness: 0.7, color: palettes[selectedPalette].primary },
    secondary: { enabled: true, opacity: 1.0, thickness: 0.4, color: palettes[selectedPalette].secondary },
    local: { enabled: true, opacity: 0.9, thickness: 0.1, color: palettes[selectedPalette].local }
  });

  const mockCitySearch = (query) => {
    // Mock search results
    return [
      `${query}, Vietnam`,
      `${query} City, Vietnam`,
      `${query} District, Ho Chi Minh City, Vietnam`
    ];
  };

  const handleCitySearch = () => {
    if (!selectedCity.trim()) return;
    const results = mockCitySearch(selectedCity);
    setSearchResults(results);
  };

  const confirmCity = (city) => {
    setConfirmedCity(city);
    setSearchResults([]);
    setCurrentStep(2);
  };

  const applyPalette = (paletteName) => {
    const palette = palettes[paletteName];
    setLayerSettings(prev => ({
      water: { ...prev.water, color: palette.water },
      building: { ...prev.building, color: palette.building },
      motorway: { ...prev.motorway, color: palette.motorway },
      primary: { ...prev.primary, color: palette.primary },
      secondary: { ...prev.secondary, color: palette.secondary },
      local: { ...prev.local, color: palette.local }
    }));
  };

  const generateMap = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate generation process
    const steps = ['Loading roads...', 'Loading water features...', 'Loading buildings...', 'Classifying roads...', 'Rendering map...', 'Saving image...'];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }
    
    setIsGenerating(false);
    alert('Map generated successfully!');
  };

  const LayerControl = ({ layerId, label, hasThickness = false }) => {
    const layer = layerSettings[layerId];
    
    return (
      <div className="bg-gray-50 rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLayerSettings(prev => ({
                ...prev,
                [layerId]: { ...prev[layerId], enabled: !prev[layerId].enabled }
              }))}
              className={`p-1 rounded ${layer.enabled ? 'text-blue-600' : 'text-gray-400'}`}
            >
              {layer.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <span className="font-medium text-sm">{label}</span>
          </div>
          <input
            type="color"
            value={layer.color}
            onChange={(e) => setLayerSettings(prev => ({
              ...prev,
              [layerId]: { ...prev[layerId], color: e.target.value }
            }))}
            className="w-8 h-8 rounded border cursor-pointer"
            disabled={!layer.enabled}
          />
        </div>
        
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Opacity: {(layer.opacity * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={layer.opacity}
              onChange={(e) => setLayerSettings(prev => ({
                ...prev,
                [layerId]: { ...prev[layerId], opacity: parseFloat(e.target.value) }
              }))}
              className="w-full"
              disabled={!layer.enabled}
            />
          </div>
          
          {hasThickness && (
            <div>
              <label className="text-xs text-gray-600 block mb-1">
                Thickness: {layer.thickness?.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={layer.thickness || 0.5}
                onChange={(e) => setLayerSettings(prev => ({
                  ...prev,
                  [layerId]: { ...prev[layerId], thickness: parseFloat(e.target.value) }
                }))}
                className="w-full"
                disabled={!layer.enabled}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Map Generator</h1>
        <p className="text-gray-600">Create beautiful custom maps of any city with just a few clicks</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>
        
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="relative">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
              currentStep >= step 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white border-gray-300 text-gray-500'
            }`}>
              {step}
            </div>
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
              {step === 1 && 'Select City'}
              {step === 2 && 'Choose Data'}
              {step === 3 && 'Customize Style'}
              {step === 4 && 'Generate'}
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: City Selection */}
      {currentStep === 1 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="text-blue-500" size={20} />
            Step 1: Select Your City
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter city name (e.g., Saigon, Ha Noi, Tokyo...)"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
              />
              <button
                onClick={handleCitySearch}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Search size={16} />
                Search
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-100 border-b">
                  <span className="text-sm font-medium">Select the correct location:</span>
                </div>
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => confirmCity(result)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                  >
                    {result}
                  </button>
                ))}
              </div>
            )}
            
            {confirmedCity && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Selected: {confirmedCity}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Data Selection */}
      {currentStep === 2 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Choose Data Types</h2>
          <p className="text-gray-600 mb-4">Select which map features to include (roads are always included)</p>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-blue-50">
              <input
                type="checkbox"
                checked={loadWater}
                onChange={(e) => setLoadWater(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium">Water Features</span>
              <span className="text-sm text-gray-500">(Rivers, lakes, coastlines)</span>
            </label>
            
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:bg-blue-50">
              <input
                type="checkbox"
                checked={loadBuildings}
                onChange={(e) => setLoadBuildings(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="font-medium">Buildings</span>
              <span className="text-sm text-gray-500">(Building footprints and structures)</span>
            </label>
          </div>
          
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Style Customization */}
      {currentStep === 3 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="text-blue-500" size={20} />
            Step 3: Customize Style
          </h2>
          
          {/* Palette Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Choose a Color Palette</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(palettes).map(paletteName => (
                <button
                  key={paletteName}
                  onClick={() => {
                    setSelectedPalette(paletteName);
                    applyPalette(paletteName);
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedPalette === paletteName 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium mb-2">{paletteName}</div>
                  <div className="flex gap-1">
                    {Object.values(palettes[paletteName]).slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-sm border"
                        style={{ backgroundColor: color }}
                      ></div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <Settings size={16} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Layer Settings
          </button>

          {/* Layer Controls */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <LayerControl layerId="water" label="Water Features" />
              <LayerControl layerId="building" label="Buildings" />
              <LayerControl layerId="motorway" label="Motorways" hasThickness />
              <LayerControl layerId="primary" label="Primary Roads" hasThickness />
              <LayerControl layerId="secondary" label="Secondary Roads" hasThickness />
              <LayerControl layerId="local" label="Local Roads" hasThickness />
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generation */}
      {currentStep === 4 && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Step 4: Generate Your Map</h2>
          
          {/* Summary */}
          <div className="bg-white rounded-lg p-4 mb-4 border">
            <h3 className="font-medium mb-2">Generation Summary:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• City: {confirmedCity}</li>
              <li>• Style: {selectedPalette}</li>
              <li>• Water features: {loadWater ? 'Included' : 'Not included'}</li>
              <li>• Buildings: {loadBuildings ? 'Included' : 'Not included'}</li>
            </ul>
          </div>

          {!isGenerating ? (
            <button
              onClick={generateMap}
              className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
            >
              <Download size={20} />
              Generate My Map
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="font-medium">Generating your map...</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {generationProgress.toFixed(0)}% complete
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isGenerating}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="text-blue-500 mt-0.5" size={16} />
          <div className="text-sm">
            <p className="font-medium text-blue-800 mb-1">Tips for best results:</p>
            <ul className="text-blue-700 space-y-1">
              <li>• Try different city names if search doesn't work (e.g., "Ho Chi Minh City" instead of "Saigon")</li>
              <li>• Water and building data may not be available for all locations</li>
              <li>• Generation time varies based on city size and selected data types</li>
              <li>• Use advanced settings to fine-tune your map's appearance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapGeneratorUI;