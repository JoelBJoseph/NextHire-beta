"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Briefcase, Users, Building, Target, Star } from "lucide-react"
import { motion } from "framer-motion"

// Optimize animations to reduce layout shifts and improve performance
const fadeIn = {
  hidden: { opacity: 0, y: 10 }, // Reduced y value from 20 to 10 for subtler animation
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }, // Reduced from 0.6 to 0.4 for faster animation
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Reduced from 0.2 to 0.1 for faster staggering
    },
  },
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="container px-4 md:px-6 relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            <motion.div className="flex flex-col space-y-4" initial="hidden" animate="visible" variants={fadeIn}>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  NextHire - Connecting Students to Opportunities
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl dark:text-gray-200">
                  Find your dream job and kickstart your career with our cutting-edge college placement platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/offers">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Browse Offers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block"
            >
              <Image
                src="/home-photo.jpg"
                alt="Career opportunities"
                width={500}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose Us?</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl max-w-3xl mx-auto">
              We provide comprehensive placement solutions for students and employers
            </p>
          </motion.div>

          <motion.div
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="flex flex-col items-center space-y-4 text-center" variants={fadeIn}>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold">Diverse Opportunities</h3>
              <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                Access a wide range of job opportunities from top companies across various industries.
              </p>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-4 text-center" variants={fadeIn}>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold">Expert Guidance</h3>
              <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                Receive personalized career advice and support from our experienced placement team.
              </p>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-4 text-center" variants={fadeIn}>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Building className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold">Industry Connections</h3>
              <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                Build valuable connections with industry leaders through our extensive network.
              </p>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-4 text-center" variants={fadeIn}>
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold">Career Development</h3>
              <p className="max-w-[300px] text-gray-500 dark:text-gray-400">
                Access workshops, training sessions, and resources to enhance your professional skills.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Success Stories</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-xl max-w-3xl mx-auto">
              Hear from students who found their dream jobs through our platform
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Software Engineer at Google</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &#34;NextHire helped me land my dream job at Google. The platform made it easy to find and apply for
                positions that matched my skills and interests.&#34;
              </p>
            </motion.div>

            <motion.div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data Scientist at Amazon</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &#34;The career guidance and resume tips from NextHire were invaluable. I received multiple job offers and
                found the perfect position at Amazon.&#34;
              </p>
            </motion.div>

            <motion.div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm" variants={fadeIn}>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">UX Designer at Adobe</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                &#34;As a design student, I was worried about finding the right job. NextHire connected me with companies
                looking for my exact skills, and now I&#39;m thriving at Adobe.&#34;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="flex flex-col items-center space-y-2 text-center" variants={fadeIn}>
              <span className="text-5xl font-bold">500+</span>
              <span className="text-blue-100">Partner Companies</span>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-2 text-center" variants={fadeIn}>
              <span className="text-5xl font-bold">10,000+</span>
              <span className="text-blue-100">Students Placed</span>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-2 text-center" variants={fadeIn}>
              <span className="text-5xl font-bold">95%</span>
              <span className="text-blue-100">Success Rate</span>
            </motion.div>

            <motion.div className="flex flex-col items-center space-y-2 text-center" variants={fadeIn}>
              <span className="text-5xl font-bold">24/7</span>
              <span className="text-blue-100">Support</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-indigo-800 via-blue-700 to-blue-600">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center space-y-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Start Your Career Journey?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-200 md:text-xl">
                Join thousands of students who have found their dream jobs through our platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

