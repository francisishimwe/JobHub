/**
 * Simple Browser-Compatible Test Script for Adding Sample Exam
 * 
 * Copy and paste this entire script into your browser console
 * when your app is running at localhost:3000
 */

async function addTestExam() {
    const examData = {
        title: "Software Engineering Fundamentals",
        category: "Computer Science",
        duration: "60 minutes",
        difficulty: "Intermediate",
        description: "Test your knowledge of core software engineering concepts including data structures, algorithms, and design patterns.",
        topics: ["Data Structures", "Algorithms", "OOP", "Design Patterns", "Testing"]
    }

    const questions = [
        {
            questionText: "What is the time complexity of Binary Search?",
            questionType: "multiple-choice",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correctAnswer: "O(log n)",
            explanation: "Binary search divides the search interval in half each time, resulting in O(log n) complexity.",
            points: 10,
            orderNumber: 1
        },
        {
            questionText: "Which data structure uses LIFO principle?",
            questionType: "multiple-choice",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswer: "Stack",
            explanation: "A Stack follows Last In First Out (LIFO) principle.",
            points: 10,
            orderNumber: 2
        },
        {
            questionText: "Inheritance allows a class to inherit properties from another class.",
            questionType: "true-false",
            options: ["True", "False"],
            correctAnswer: "True",
            explanation: "Inheritance is a fundamental OOP concept.",
            points: 5,
            orderNumber: 3
        },
        {
            questionText: "What design pattern ensures only one instance of a class?",
            questionType: "multiple-choice",
            options: ["Factory", "Observer", "Singleton", "Strategy"],
            correctAnswer: "Singleton",
            explanation: "The Singleton pattern restricts instantiation to a single instance.",
            points: 10,
            orderNumber: 4
        },
        {
            questionText: "A linked list requires contiguous memory.",
            questionType: "true-false",
            options: ["True", "False"],
            correctAnswer: "False",
            explanation: "Linked lists do not require contiguous memory; nodes can be anywhere.",
            points: 5,
            orderNumber: 5
        }
    ]

    try {
        console.log('🚀 Adding test exam...')

        // Get Supabase client from your app context
        const supabaseUrl = localStorage.getItem('supabaseUrl') || prompt('Enter Supabase URL:')
        const supabaseKey = localStorage.getItem('supabaseKey') || prompt('Enter Supabase Anon Key:')

        // Make a direct API call using fetch
        const response = await fetch(`${supabaseUrl}/rest/v1/exams`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify({
                title: examData.title,
                category: examData.category,
                duration: examData.duration,
                difficulty: examData.difficulty,
                description: examData.description,
                topics: examData.topics
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const [exam] = await response.json()
        console.log('✅ Exam created:', exam.id)

        // Add questions
        const questionsToInsert = questions.map(q => ({
            exam_id: exam.id,
            question_text: q.questionText,
            question_type: q.questionType,
            options: q.options ? JSON.stringify(q.options) : null,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points,
            order_number: q.orderNumber
        }))

        const questionsResponse = await fetch(`${supabaseUrl}/rest/v1/exam_questions`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(questionsToInsert)
        })

        if (!questionsResponse.ok) {
            throw new Error(`HTTP error! status: ${questionsResponse.status}`)
        }

        const insertedQuestions = await questionsResponse.json()
        console.log(`✅ ${insertedQuestions.length} questions added!`)
        console.log('🎉 Test exam created successfully!')
        console.log(`   Exam ID: ${exam.id}`)
        console.log(`   View at: /exams/${exam.id}`)

        return { success: true, examId: exam.id }
    } catch (error) {
        console.error('❌ Error:', error)
        return { success: false, error }
    }
}

// Run it
console.log('📝 To add a test exam, run: addTestExam()')
