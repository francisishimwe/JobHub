// Simple Node.js script to add a test exam to Supabase
// Run with: node scripts/quick-add-exam.js

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Read .env.local file manually
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env.local')
        const envFile = fs.readFileSync(envPath, 'utf8')
        const env = {}

        envFile.split('\n').forEach(line => {
            const match = line.match(/^([^=:#]+)=(.*)$/)
            if (match) {
                const key = match[1].trim()
                const value = match[2].trim()
                env[key] = value
            }
        })

        return env
    } catch (error) {
        console.error('❌ Error reading .env.local file:', error.message)
        console.log('\n💡 Make sure you have a .env.local file with:')
        console.log('   NEXT_PUBLIC_SUPABASE_URL=your-url')
        console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key\n')
        process.exit(1)
    }
}

const env = loadEnv()
const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const examData = {
    title: "Web Development Essentials",
    category: "Web Development",
    duration: "45 minutes",
    difficulty: "Intermediate",
    description: "Test your knowledge of HTML, CSS, JavaScript, and modern web development practices.",
    topics: ["HTML", "CSS", "JavaScript", "React", "Web APIs"],
    participants: 0,
    rating: 0
}

const questions = [
    {
        questionText: "What does HTML stand for?",
        questionType: "multiple-choice",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language"
        ],
        correctAnswer: "Hyper Text Markup Language",
        explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages.",
        points: 5
    },
    {
        questionText: "CSS stands for Cascading Style Sheets.",
        questionType: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "CSS (Cascading Style Sheets) is used to style and layout web pages.",
        points: 5
    },
    {
        questionText: "Which method is used to add an element at the end of an array in JavaScript?",
        questionType: "multiple-choice",
        options: ["append()", "push()", "add()", "insert()"],
        correctAnswer: "push()",
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
        points: 10
    },
    {
        questionText: "JavaScript is a compiled language.",
        questionType: "true-false",
        options: ["True", "False"],
        correctAnswer: "False",
        explanation: "JavaScript is an interpreted language, not a compiled one. It is executed line by line at runtime.",
        points: 5
    },
    {
        questionText: "What does API stand for?",
        questionType: "short-answer",
        correctAnswer: "Application Programming Interface",
        explanation: "API stands for Application Programming Interface, which allows different software applications to communicate.",
        points: 10
    },
    {
        questionText: "Which HTML tag is used to define an external JavaScript file?",
        questionType: "multiple-choice",
        options: ["<javascript>", "<js>", "<script>", "<code>"],
        correctAnswer: "<script>",
        explanation: "The <script> tag is used to embed or reference JavaScript code in HTML documents.",
        points: 10
    },
    {
        questionText: "React is a JavaScript library for building user interfaces.",
        questionType: "true-false",
        options: ["True", "False"],
        correctAnswer: "True",
        explanation: "React is a popular JavaScript library developed by Facebook for building user interfaces, especially single-page applications.",
        points: 5
    },
    {
        questionText: "Which CSS property is used to change the text color?",
        questionType: "multiple-choice",
        options: ["text-color", "color", "font-color", "text-style"],
        correctAnswer: "color",
        explanation: "The 'color' property in CSS is used to set the color of text.",
        points: 10
    }
]

async function addExam() {
    console.log('\n🚀 Adding Web Development Essentials exam...\n')

    try {
        // Insert exam
        const { data: exam, error: examError } = await supabase
            .from('exams')
            .insert([examData])
            .select()
            .single()

        if (examError) throw examError

        console.log('✅ Exam created:')
        console.log(`   ID: ${exam.id}`)
        console.log(`   Title: ${exam.title}`)
        console.log(`   Category: ${exam.category}\n`)

        // Insert questions
        const questionsToInsert = questions.map((q, index) => ({
            exam_id: exam.id,
            question_text: q.questionText,
            question_type: q.questionType,
            options: q.options ? JSON.stringify(q.options) : null,
            correct_answer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points,
            order_number: index + 1
        }))

        const { data: questionResults, error: questionsError } = await supabase
            .from('exam_questions')
            .insert(questionsToInsert)
            .select()

        if (questionsError) throw questionsError

        const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

        console.log('✅ Questions added:')
        console.log(`   Count: ${questionResults.length}`)
        console.log(`   Total Points: ${totalPoints}\n`)
        console.log('🎉 Success! Exam is ready to use.')
        console.log(`   View at: http://localhost:3000/exams/${exam.id}\n`)

    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

addExam()
