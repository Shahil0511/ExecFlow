
import { motion } from 'framer-motion'
import { CheckCircle, Users, BarChart3, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

// Hero Component
export const HeroSection = ({ onGetStarted }: { onGetStarted: () => void }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
                    >
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span className="text-white font-medium">Revolutionize Your Workflow</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    >
                        TaskFlow
                        <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                            {" "}Manager
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Transform your productivity with AI-powered task management. Collaborate seamlessly with your executive assistant and unlock unprecedented efficiency.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                            className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="border-2 border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                        >
                            Watch Demo
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
                >
                    {[
                        {
                            icon: CheckCircle,
                            title: 'Smart Task Management',
                            description: 'AI-powered task prioritization with intelligent deadline tracking and automated reminders.',
                            color: 'from-green-400 to-blue-500'
                        },
                        {
                            icon: Users,
                            title: 'Seamless Collaboration',
                            description: 'Real-time collaboration with your executive assistant and team members across all devices.',
                            color: 'from-purple-400 to-pink-500'
                        },
                        {
                            icon: BarChart3,
                            title: 'Advanced Analytics',
                            description: 'Comprehensive reporting with Excel exports and productivity insights to optimize performance.',
                            color: 'from-yellow-400 to-red-500'
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + i * 0.2 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group"
                        >
                            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="mt-20 text-center"
                >
                    <div className="flex items-center justify-center gap-8 text-white/60">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            <span>Enterprise Security</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            <span>99.9% Uptime</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            <span>10K+ Users</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
