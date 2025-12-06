/**
 * Test Script to Add Sample Exam to Supabase
 * 
 * This script creates a complete exam with multiple questions
 * Run this from a Node.js environment or browser console
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample Exam Data
const sampleExam = {
    title: "Software Engineering Fundamentals",
    category: "Computer Science",
    duration: "60 minutes",
    difficulty: "Intermediate",
    description: "Test your knowledge of core software engineering concepts including data structures, algorithms, and design patterns. This exam covers fundamental topics essential for any software developer.",
    topics: [
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming",
        "Design Patterns",
        "Software Testing"
    ]
}

// Sample Questions
const sampleQuestions = [
    {
        questionText: "What is the time complexity of Binary Search in a sorted array?",
        questionType: "multiple-choice" as const,
        options: [
            "O(n)",
            "O(log n)",
            "O(n²)",
            "O(1)"
        ],
        correctAnswer: "O(log n)",
        explanation: "Binary search repeatedly divides the search interval in half, resulting in logarithmic time complexity O(log n).",
        points: 10,
        orderNumber: 1
    },
    {
        questionText: "Which data structure uses LIFO (Last In First Out) principle?",
        questionType: "multiple-choice" as const,
        options: [
            "Queue",
            "Stack",
            "Array",
            "Linked List"
        ],
        correctAnswer: "Stack",
        explanation: "A Stack follows the Last In First Out (LIFO) principle, where the most recently added element is removed first.",
        points: 10,
        orderNumber: 2
    },
    {
        questionText: "In Object-Oriented Programming, inheritance allows a class to inherit properties from another class.",
        questionType: "true-false" as const,
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "Inheritance is a fundamental OOP concept that allows a class (child/derived class) to inherit properties and methods from another class (parent/base class).",
        points: 5,
        orderNumber: 3
    },
    {
        questionText: "What design pattern ensures a class has only one instance?",
        questionType: "multiple-choice" as const,
        options: [
            "Factory Pattern",
            "Observer Pattern",
            "Singleton Pattern",
            "Strategy Pattern"
        ],
        correctAnswer: "Singleton Pattern",
        explanation: "The Singleton pattern restricts instantiation of a class to a single instance and provides global access to that instance.",
        points: 10,
        orderNumber: 4
    },
    {
        questionText: "Which of the following is NOT a valid sorting algorithm?",
        questionType: "multiple-choice" as const,
        options: [
            "Bubble Sort",
            "Quick Sort",
            "Binary Sort",
            "Merge Sort"
        ],
        correctAnswer: "Binary Sort",
        explanation: "Binary Sort is not a standard sorting algorithm. The others (Bubble Sort, Quick Sort, and Merge Sort) are all valid sorting algorithms.",
        points: 10,
        orderNumber: 5
    },
    {
        questionText: "A linked list requires contiguous memory allocation.",
        questionType: "true-false" as const,
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Unlike arrays, linked lists do not require contiguous memory. Each node can be stored anywhere in memory, connected via pointers/references.",
        points: 5,
        orderNumber: 6
    },
    {
        questionText: "What is the main advantage of using a Hash Table?",
        questionType: "multiple-choice" as const,
        options: [
            "Ordered storage of elements",
            "Fast average-case lookup time O(1)",
            "Memory efficiency",
            "Guaranteed O(1) worst-case complexity"
        ],
        correctAnswer: "Fast average-case lookup time O(1)",
        explanation: "Hash tables provide constant time O(1) average-case performance for insertions, deletions, and lookups, making them very efficient for these operations.",
        points: 10,
        orderNumber: 7
    },
    {
        questionText: "What does TDD stand for in software development?",
        questionType: "short-answer" as const,
        correctAnswer: "Test Driven Development",
        explanation: "TDD (Test Driven Development) is a software development approach where tests are written before the actual code.",
        points: 5,
        orderNumber: 8
    },
    {
        questionText: "Which Big O notation represents the worst-case time complexity of Bubble Sort?",
        questionType: "multiple-choice" as const,
        options: [
            "O(n)",
            "O(n log n)",
            "O(n²)",
            "O(2ⁿ)"
        ],
        correctAnswer: "O(n²)",
        explanation: "Bubble Sort has a worst-case and average-case time complexity of O(n²) because it uses nested loops to compare and swap elements.",
        points: 10,
        orderNumber: 9
    },
    {
        questionText: "Recursion always uses less memory than iteration.",
        questionType: "true-false" as const,
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "Recursion typically uses more memory than iteration because each recursive call adds a new layer to the call stack. Iteration generally uses constant space.",
        points: 5,
        orderNumber: 10
    }
]

async function addSampleExamToSupabase() {
    console.log('🚀 Starting to add sample exam to Supabase...\n')

    try {
        // Step 1: Insert the exam
        console.log('📝 Inserting exam...')
        const { data: examResult, error: examError } = await supabase
            .from('exams')
            .insert([
                {
                    title: sampleExam.title,
                    category: sampleExam.category,
                    duration: sampleExam.duration,
                    difficulty: sampleExam.difficulty,
                    description: sampleExam.description,
                    topics: sampleExam.topics,
                }
            ])
            .select()
            .single()

        if (examError) {
            console.error('❌ Error inserting exam:', examError)
            throw examError
        }

        console.log('✅ Exam created successfully!')
        console.log('   Exam ID:', examResult.id)
        console.log('   Title:', examResult.title)
        console.log('')

        // Step 2: Insert the questions
        console.log('📋 Inserting questions...')
        const questionsToInsert = sampleQuestions.map((q, index) => ({
            exam_id: examResult.id,
            question_text: q.questionText,
            question_type: q.questionType,
            options: q.options ? JSON.stringify(q.options) : null,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points,
            order_number: q.orderNumber
        }))

        const { data: questionsResult, error: questionsError } = await supabase
            .from('exam_questions')
            .insert(questionsToInsert)
            .select()

        if (questionsError) {
            console.error('❌ Error inserting questions:', questionsError)
            throw questionsError
        }

        console.log(`✅ ${questionsResult.length} questions added successfully!`)
        console.log('')

        // Step 3: Calculate totals
        const totalQuestions = sampleQuestions.length
        const totalPoints = sampleQuestions.reduce((sum, q) => sum + q.points, 0)

        console.log('📊 Summary:')
        console.log('   Total Questions:', totalQuestions)
        console.log('   Total Points:', totalPoints)
        console.log('   Categories:', sampleExam.topics.join(', '))
        console.log('')
        console.log('🎉 Sample exam successfully added to Supabase!')
        console.log(`   View it in your app at: /exams/${examResult.id}`)

        return {
            success: true,
            examId: examResult.id,
            questionsCount: questionsResult.length
        }

    } catch (error) {
        console.error('❌ Failed to add sample exam:', error)
        return {
            success: false,
            error
        }
    }
}

// Run the script
if (typeof window === 'undefined') {
    // Node.js environment
    addSampleExamToSupabase()
        .then(result => {
            if (result.success) {
                console.log('\n✅ Script completed successfully!')
                process.exit(0)
            } else {
                console.error('\n❌ Script failed!')
                process.exit(1)
            }
        })
} else {
    // Browser environment
    console.log('Running in browser environment...')
    console.log('Call addSampleExamToSupabase() to execute the script')
}

// Export for browser use
export { addSampleExamToSupabase, sampleExam, sampleQuestions }
