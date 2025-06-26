// 🧠 SHOW GENERATOR - ENHANCED WITH SUPABASE DATA

'use client';

import { useState } from 'react';
import { Brain, Zap, Settings } from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { usePresets } from '../../hooks/usePresets';

interface ShowGeneratorProps {
  onGenerate?: () => Promise<void>;
}

export function ShowGenerator({ onGenerate }: ShowGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [newsCount, setNewsCount] = useState(3);
  const [customChannel, setCustomChannel] = useState('');
  
  const { presets, voices, loading, error } = usePresets();

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Show generation via backend API (out of scope for now)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onGenerate) {
        await onGenerate();
      }
      
      const selectedPresetData = presets.find(p => p.preset_name === selectedPreset);
      
      console.log('Show generation would happen with:', {
        preset: selectedPreset,
        preset_data: selectedPresetData,
        news_count: newsCount,
        custom_channel: customChannel || selectedPresetData?.city_focus
      });
    } catch (error) {
      console.error('Show generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-300 text-sm">Error: {error}</p>
      </div>
    );
  }

  const selectedPresetData = presets.find(p => p.preset_name === selectedPreset);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          AI Show Generator
        </h3>
        <p className="text-gray-300 text-sm">
          Wähle ein Preset und generiere eine personalisierte Radio Show
        </p>
      </div>

      {/* Preset Selection */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Show Preset
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="" className="bg-gray-800">Preset wählen...</option>
            {presets.map(preset => (
              <option key={preset.id} value={preset.preset_name} className="bg-gray-800">
                {preset.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Preset Details */}
        {selectedPresetData && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2 mb-2">
              <Settings className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-medium text-sm">{selectedPresetData.display_name}</h4>
                <p className="text-gray-300 text-xs mt-1">{selectedPresetData.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div>
                <span className="text-gray-400">Fokus:</span>
                <span className="text-white ml-1">{selectedPresetData.city_focus || 'Global'}</span>
              </div>
              <div>
                <span className="text-gray-400">Speaker:</span>
                <span className="text-white ml-1">{selectedPresetData.primary_speaker}</span>
              </div>
              {selectedPresetData.secondary_speaker && (
                <div>
                  <span className="text-gray-400">Co-Speaker:</span>
                  <span className="text-white ml-1">{selectedPresetData.secondary_speaker}</span>
                </div>
              )}
              {selectedPresetData.rss_feed_filter && (
                <div className="col-span-2">
                  <span className="text-gray-400">Filter:</span>
                  <span className="text-white ml-1 text-xs">{selectedPresetData.rss_feed_filter}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* News Count */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            News Anzahl
          </label>
          <select
            value={newsCount}
            onChange={(e) => setNewsCount(Number(e.target.value))}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
          >
            <option value={1} className="bg-gray-800">1 News</option>
            <option value={2} className="bg-gray-800">2 News</option>
            <option value={3} className="bg-gray-800">3 News</option>
            <option value={5} className="bg-gray-800">5 News</option>
          </select>
        </div>

        {/* Custom Channel Override */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Channel Override (optional)
          </label>
          <select
            value={customChannel}
            onChange={(e) => setCustomChannel(e.target.value)}
            className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="" className="bg-gray-800">Standard (aus Preset)</option>
            <option value="zurich" className="bg-gray-800">Zürich</option>
            <option value="basel" className="bg-gray-800">Basel</option>
            <option value="bern" className="bg-gray-800">Bern</option>
            <option value="global" className="bg-gray-800">Global</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !selectedPreset}
        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
      >
        {isGenerating ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Show generieren
          </>
        )}
      </button>

      {/* Generation Status */}
      {isGenerating && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <div>
              <p className="text-blue-300 font-medium">Backend API wird aufgerufen...</p>
              <p className="text-gray-400 text-sm">
                Show-Generation über Backend (aktuell simuliert)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Voices Info */}
      {voices.length > 0 && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
          <h4 className="text-purple-300 font-medium text-sm mb-2">Verfügbare Sprecher</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {voices.map(voice => (
              <div key={voice.id} className="flex justify-between">
                <span className="text-gray-300">{voice.speaker_name}</span>
                <span className="text-purple-200">{voice.voice_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 