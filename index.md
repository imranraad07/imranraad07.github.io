<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mia Mohammad Imran - Academic Profile</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            line-height: 1.6;
            padding: 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 60px 40px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 500px;
            height: 500px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
        }

        .header-content {
            position: relative;
            z-index: 1;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .research-interests {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }

        .tag {
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.3);
            transition: all 0.3s ease;
        }

        .tag:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }

        .quick-links {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 25px;
        }

        .quick-link {
            background: white;
            color: #2a5298;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .quick-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            background: #f0f0f0;
        }

        .content {
            padding: 40px;
        }

        .announcement {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 5px solid #ff6b6b;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .announcement p {
            margin: 0;
            font-weight: 600;
            color: #333;
        }

        h2 {
            color: #2a5298;
            margin: 30px 0 20px 0;
            font-size: 2em;
            position: relative;
            padding-bottom: 10px;
        }

        h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 2px;
        }

        .news-item {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 10px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }

        .news-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.12);
        }

        .date {
            color: #667eea;
            font-weight: 700;
            margin-right: 10px;
        }

        .news-item a {
            color: #2a5298;
            text-decoration: none;
            font-weight: 600;
        }

        .news-item a:hover {
            text-decoration: underline;
        }

        .section {
            background: white;
            padding: 25px;
            margin: 20px 0;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }

        .committee-list, .journal-list {
            list-style: none;
            padding-left: 0;
        }

        .committee-list li, .journal-list li {
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .committee-list li:last-child, .journal-list li:last-child {
            border-bottom: none;
        }

        .advisor-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }

        .advisor-name {
            font-weight: 700;
            color: #2a5298;
        }

        .advisor-info {
            color: #666;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 1.8em;
            }
            
            .header {
                padding: 40px 20px;
            }
            
            .content {
                padding: 20px;
            }
            
            .quick-links {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-content">
                <h1>Mia Mohammad Imran</h1>
                <p class="subtitle">Assistant Professor | Department of Computer Science<br>Missouri University of Science and Technology</p>
                
                <div class="research-interests">
                    <span class="tag">Software Engineering</span>
                    <span class="tag">Empirical Study</span>
                    <span class="tag">Machine Learning</span>
                    <span class="tag">LLMs</span>
                    <span class="tag">NLP</span>
                    <span class="tag">Bug Reports</span>
                    <span class="tag">Code Quality</span>
                </div>

                <div class="quick-links">
                    <a href="posts/documents/CV.pdf" class="quick-link">📄 CV</a>
                    <a href="https://linkedin.com/in/imranraad" class="quick-link">💼 LinkedIn</a>
                    <a href="https://github.com/imranraad07" class="quick-link">💻 GitHub</a>
                    <a href="https://scholar.google.com/citations?user=uVCaRjAAAAAJ&hl=en" class="quick-link">🎓 Google Scholar</a>
                    <a href="mailto:imranm@mst.edu" class="quick-link">✉️ Email</a>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="announcement">
                <p>🚀 I'm currently seeking collaborations with industry partners and enthusiastic undergraduate students to join my research team. Please contact me if you are interested.</p>
            </div>

            <h2>📰 News</h2>
            <div class="news-item">
                <span class="date">January 2026:</span> Our Short Paper titled <a href="/posts/documents/TechDebt_26_SATD_in_SA_genAI_Comments.pdf">"TODO: Fix the Mess Gemini Created": Towards Understanding GenAI-Induced Self-Admitted Technical Debt</a> got accepted at TechDebt 2026! First paper of Mujahid (Congrats Mujahid)!
            </div>
            
            <div class="news-item">
                <span class="date">Dec 2025:</span> Our paper titled <a href="/posts/documents/ICSE_2026_Derailment.pdf">Toxicity Ahead: Forecasting Conversational Derailment on GitHub</a> got accepted at ICSE 2026 (Research Track)!
            </div>

            <div class="news-item">
                <span class="date">Dec 2025:</span> Our paper titled <a href="/posts/documents/ICSE_SEET_2026.pdf">Learning Programming in Informal Spaces: Using Emotion as a Lens to Understand Novice Struggles on r/learnprogramming</a> got accepted at ICSE-SEET 2026 (Education Research Track)!
            </div>

            <div class="news-item">
                <span class="date">Dec 2025:</span> Our extended abstract titled <a href="https://se-llm-annotation-olaf.github.io/olaf/">OLAF: Towards Robust LLM-Based Annotation Framework in Empirical Software Engineering</a> got accepted at WSESE Workshop 2026 (ICSE Companion)!
            </div>

            <div class="news-item">
                <span class="date">Summer 2025:</span> <a href="/posts/documents/ReviewerAward-Mia.pdf">Best Reviewer award at EASE 2025!</a>
            </div>

            <div class="news-item">
                <span class="date">March 2025:</span> Our paper titled <a href="https://arxiv.org/pdf/2503.10072">"Silent Is Not Actually Silent": An Investigation of Toxicity on Bug Report Discussion</a> got accepted at FSE-IVR 2026 (Idea Vision Track)!
            </div>

            <div class="news-item">
                <span class="date">March 2025:</span> Our paper titled <a href="https://dl.acm.org/doi/pdf/10.1145/3696630.3728701">LLPut: Investigating Large Language Models for Bug Report-Based Input Generation</a> got accepted at LLanMER 2025 (FSE Companion)!
            </div>

            <h2>🔬 Reviewing and Community Services</h2>
            
            <div class="section">
                <h3>Conference Committee:</h3>
                <ul class="committee-list">
                    <li>SANER 2026 (Short Paper Track)</li>
                    <li>EASE 2026 (Short Paper Track)</li>
                    <li>SIGCSE TS 2026 (Experience Reports and Tools Track)</li>
                    <li>EASE 2025 (Short Paper Track)</li>
                    <li>EASE 2025 (Learnings & Reflections within the Learnings/Reflections of Evaluation and Assessment projects in Software Engineering-track)</li>
                    <li>AI IDE 2025 (FSE Workshop)</li>
                </ul>
            </div>

            <div class="section">
                <h3>Journals:</h3>
                <ul class="journal-list">
                    <li>Reviewer at IEEE Transactions on Software Engineering, Empirical Software Engineering, Information and Software Technology, Automated Software Engineering</li>
                </ul>
            </div>

            <h2>👨‍🎓 Prospective Students</h2>
            <div class="section">
                <p>If you are already an undergrad student at Missouri S&T, please feel free to email me to talk about potential research opportunities.</p>
                
                <p style="margin-top: 15px;"><strong>Not Hiring PhD or Master's students.</strong></p>
                
                <p style="margin-top: 15px;">If you're interested in joining my research team, please contact me at <a href="mailto:imranm@mst.edu">imranm@mst.edu</a>. In your email, include a brief introduction, interests and attach your CV (if you can). I am currently recruiting students at all levels, from undergraduate and masters (if you are already in Missouri S&T), to graduate. If you don't hear back from me within a week, feel free to send a follow-up message as things can get busy.</p>
                
                <p style="margin-top: 15px;">When you are emailing, here is a guideline you can follow: <a href="https://uvasrg.github.io/prospective/">Link</a></p>
            </div>

            <h2>👥 Advising</h2>
            <div class="advisor-card">
                <div class="advisor-name">Abdullah Al Mujahid</div>
                <div class="advisor-info">PhD (2025-)</div>
            </div>
            <div class="advisor-card">
                <div class="advisor-name">Fariha Fariha Tanjim Shifat</div>
                <div class="advisor-info">PhD (2025-)</div>
            </div>

            <h2>📚 Previously Advised</h2>
            <div class="advisor-card">
                <div class="advisor-name">Carson Kempf</div>
                <div class="advisor-info">Undergraduate (2025)</div>
            </div>
            <div class="advisor-card">
                <div class="advisor-name">Piper Jeffries</div>
                <div class="advisor-info">Undergraduate (2025)</div>
            </div>
        </div>
    </div>
</body>
</html>
