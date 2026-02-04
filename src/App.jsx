import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import './index.css' 

export default function App() {
  const [word, setWord] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [recentWords, setRecentWords] = useState([])
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const inputRef = useRef(null)

  // Example words for quick input
  const exampleWords = ['sunshine', 'coffee', 'adventure', 'rain', 'success', 'stress', 'love', 'chaos', 'peace', 'excitement']

  // Auto-clear copy notification
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  // Auto-clear confetti
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const API_URL = import.meta.env.PROD 
    ? 'https://emoji-sentiment-predictor-backend.onrender.com' 
    : 'http://localhost:5000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!word.trim()) return
    
    setError('')
    setLoading(true)
    setResult(null)
    
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.trim().toLowerCase() })
      })
      
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to get prediction')
      }
      
      const data = await res.json()
      setResult(data)
      
      // Add to history
      const newEntry = { word: word.trim(), ...data, timestamp: new Date().toLocaleTimeString() }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)])
      
      // Add to recent words if not already there
      setRecentWords(prev => {
        const newWords = [word.trim(), ...prev.filter(w => w !== word.trim())]
        return newWords.slice(0, 5)
      })

      // Vibration feedback on mobile
      if (navigator.vibrate) navigator.vibrate([50, 30, 50])
      
      // Show confetti for highly positive results
      if (data.sentiment === 'positive' && data.confidence > 0.8) {
        setShowConfetti(true)
      }
    } catch (err) {
      setError(err.message || 'Connection error. Is backend deployed?')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    if (result) {
      navigator.clipboard.writeText(`${word} = ${result.emoji} ${result.sentiment} (${Math.round(result.confidence * 100)}%)`)
      setIsCopied(true)
      
      // Animation feedback
      if (navigator.vibrate) navigator.vibrate(100)
    }
  }

  const handleExampleClick = (exampleWord) => {
    setWord(exampleWord)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const clearHistory = () => {
    setHistory([])
    setRecentWords([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-indigo-300/20 to-purple-300/20"
            initial={{ 
              y: Math.random() * window.innerHeight,
              x: Math.random() * window.innerWidth,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-block p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl"
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <div className="text-5xl">✨🤖🎭</div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-3">
            Mood Emoji AI
          </h1>
          <p className="text-gray-600 text-xl mb-2">Type any word → Discover its emotional vibe</p>
          <p className="text-gray-500 text-sm">Powered by transparent AI logic</p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            >
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-indigo-400 group-hover:scale-110 transition-transform">
                      🔍
                    </div>
                    <input
                      ref={inputRef}
                      type="text"
                      value={word}
                      onChange={(e) => {
                        setWord(e.target.value)
                        setError('')
                      }}
                      placeholder="Try typing: sunshine, coffee, adventure..."
                      className="w-full pl-14 pr-12 py-5 text-xl rounded-2xl border-3 border-indigo-100 bg-white/50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 placeholder:text-gray-400 shadow-lg"
                      disabled={loading}
                      autoFocus
                    />
                    {word && !loading && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="button"
                        onClick={() => {
                          setWord('')
                          setResult(null)
                          setError('')
                          inputRef.current.focus()
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                        aria-label="Clear input"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        ✕
                      </motion.button>
                    )}
                  </div>

                  {/* Quick Examples */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm text-gray-500 mr-2 self-center">Try:</span>
                    {exampleWords.map((example, index) => (
                      <motion.button
                        key={example}
                        type="button"
                        onClick={() => handleExampleClick(example)}
                        className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 hover:from-indigo-200 hover:to-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {example}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !word.trim()}
                    className={`w-full py-5 px-6 text-xl font-bold rounded-2xl transition-all duration-300 ${
                      loading || !word.trim()
                        ? 'bg-gray-200 cursor-not-allowed text-gray-400'
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/30'
                    }`}
                    whileHover={!(loading || !word.trim()) ? { scale: 1.02 } : {}}
                    whileTap={!(loading || !word.trim()) ? { scale: 0.98 } : {}}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <motion.div
                          className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Analyzing Emotion...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Reveal Emotional Vibe</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    )}
                  </motion.button>
                </form>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-xl flex items-start shadow-lg"
                    >
                      <div className="text-2xl mr-3 mt-0.5">🚨</div>
                      <div className="flex-1">
                        <div className="font-semibold text-red-700">Oops! Something went wrong</div>
                        <div className="text-red-600 text-sm">{error}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Result Display */}
                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="mt-8 pt-8 border-t border-gray-200/50"
                    >
                      <div className="flex flex-col items-center">
                        <motion.div
                          className="relative cursor-pointer"
                          onClick={copyResult}
                          title="Click to copy result"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{
                            y: [0, -10, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{
                            y: {
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            rotate: {
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                        >
                          <div className="text-9xl md:text-10xl mb-2">{result.emoji}</div>
                          {isCopied && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                            >
                              ✓ Copied!
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <div className="text-center space-y-4 w-full max-w-md">
                          <div className="space-y-2">
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                              {word.charAt(0).toUpperCase() + word.slice(1)}
                            </div>
                            <div className="text-2xl font-semibold text-gray-700">
                              is {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-gray-500 font-medium">Confidence Level</div>
                            <div className="flex items-center gap-4">
                              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${result.confidence * 100}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${
                                    result.confidence > 0.7 ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 
                                    result.confidence > 0.5 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 
                                    'bg-gradient-to-r from-rose-400 to-red-500'
                                  }`}
                                />
                              </div>
                              <div className="font-bold text-xl min-w-[60px]">
                                {Math.round(result.confidence * 100)}%
                              </div>
                            </div>
                          </div>
                          
                          <motion.button
                            onClick={copyResult}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-xl font-medium hover:shadow-md transition-shadow"
                          >
                            📋 Copy Result
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty State */}
                {!result && !error && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 pt-8 border-t border-gray-200/50 text-center"
                  >
                    <div className="flex justify-center space-x-4 text-3xl mb-4">
                      {['✨', '🔮', '🎯', '🌈'].map((emoji, i) => (
                        <motion.span
                          key={emoji}
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        >
                          {emoji}
                        </motion.span>
                      ))}
                    </div>
                    <p className="text-gray-600">Type a word above to reveal its emotional vibe!</p>
                    <p className="text-gray-500 text-sm mt-2">AI will analyze sentiment and suggest the perfect emoji</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Words */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center">
                  <span className="mr-2">⏰</span> Recent Words
                </h3>
                {recentWords.length > 0 && (
                  <button
                    onClick={() => setRecentWords([])}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentWords.length > 0 ? (
                  recentWords.map((recentWord, index) => (
                    <motion.button
                      key={`${recentWord}-${index}`}
                      onClick={() => handleExampleClick(recentWord)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50 transition-colors group flex items-center justify-between"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-700 group-hover:text-indigo-600">{recentWord}</span>
                      <span className="text-gray-400 group-hover:text-indigo-400">→</span>
                    </motion.button>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent words yet</p>
                )}
              </div>
            </motion.div>

            {/* History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800 flex items-center">
                  <span className="mr-2">📚</span> History
                  <span className="ml-2 text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">
                    {history.length}
                  </span>
                </h3>
                {history.length > 0 && (
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {showHistory ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={clearHistory}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {showHistory && history.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {history.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{entry.word}</span>
                          <span className="text-2xl">{entry.emoji}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span className={`px-2 py-1 rounded-full ${
                            entry.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                            entry.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {entry.sentiment}
                          </span>
                          <span className="text-gray-500">{entry.timestamp}</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {!showHistory && history.length > 0 && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="w-full text-center py-2 text-indigo-600 hover:text-indigo-800"
                >
                  View {history.length} history items
                </button>
              )}

              {history.length === 0 && (
                <p className="text-gray-500 text-center py-4">Your history will appear here</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6"
            >
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📊</span> Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">{history.length}</div>
                  <div className="text-sm text-gray-600">Words Analyzed</div>
                </div>
                <div className="text-center p-4 bg-white/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">
                    {history.length > 0 
                      ? Math.round(history.filter(h => h.sentiment === 'positive').length / history.length * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600">Positive Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {['React', 'Flask API', 'Tailwind CSS', 'Framer Motion', 'Rule-Based AI'].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-full text-sm font-medium shadow-lg border border-white/20"
                whileHover={{ y: -2 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
          
          <p className="text-gray-600">
            Made with <span className="text-red-500">❤️</span> by{' '}
            <a 
              href="https://github.com/YOUR_USERNAME" 
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Your Name
            </a>
          </p>
          
          <div className="mt-4 flex justify-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Privacy Policy
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Terms of Service
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
              Contact
            </button>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}