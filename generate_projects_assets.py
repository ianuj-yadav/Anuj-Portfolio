import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('public/assets/projects', exist_ok=True)

projects = [
    {
        'slug': 'tdl-gpt',
        'title': 'TDL GPT — AI Code Generator',
        'tags': 'Gen AI | Tally 4GL | Python',
        'bg': '#1e1c27',
        'accent': '#E8A589',
        'ui': 'TDL GENERATOR UI: Prompt → 4GL Output\nInput: "Generate ledger report for accounts payable"\n\n[Report: LedgerList]\n  Form: LedgerForm\n  Parts: LedgerHeader, LedgerBody',
        'flow': 'SYSTEM WORKFLOW DIAGRAM:\nUser Prompt -> System Prompt Guard -> OpenAI GPT-4o -> TDL Syntax Parser -> Valid TDL Code',
        'data': 'DATA SPECIFICATIONS:\n- Target Engine: Tally Prime 4GL\n- Latency: ~1.2s per definition\n- Verification: 99.4% syntax pass rate'
    },
    {
        'slug': 'notes-elitehub',
        'title': 'Notes-Elitehub Platform',
        'tags': 'Node.js | Express | PostgreSQL',
        'bg': '#181a24',
        'accent': '#7aa2f7',
        'ui': 'NOTES-ELITEHUB BACKEND DASHBOARD\nEndpoints: POST /api/notes | GET /api/notes/:id | PUT /api/notes/:id\nStatus: 200 OK (PostgreSQL Connection Alive)',
        'flow': 'AUTHENTICATION & API FLOW:\nClient Request -> JWT Bearer Auth -> Middleware Guard -> Controller -> PostgreSQL Pool -> JSON Payload',
        'data': 'RELATIONAL DB SCHEMA:\nUsers Table (id, email, password_hash)\nNotes Table (id, user_id, title, content, created_at)'
    },
    {
        'slug': 'visual-dsa',
        'title': 'Visual DSA Algorithm Platform',
        'tags': 'Python | Data Structures | Team Lead',
        'bg': '#161e2e',
        'accent': '#bb9af7',
        'ui': 'ALGORITHM VISUALIZER STAGE:\nDijkstra Shortest Path Engine\nNodes: 8 | Edges: 14 | Active Priority Queue: [(0, "A"), (4, "B"), (7, "C")]',
        'flow': 'VISUALIZER EXECUTION LOOP:\nAlgorithm Execution -> Step Snapshot State Generator -> Canvas 2D Graph Engine -> Step Frame Playback',
        'data': 'ALGORITHM COMPLEXITY SPECS:\n- Time Complexity: O((V + E) log V)\n- Space Complexity: O(V + E)\n- Team Role: Lead Backend Architect'
    },
    {
        'slug': 'ams-dashboard',
        'title': 'Attendance Management System (AMS)',
        'tags': 'Python | Java | RBAC Roles',
        'bg': '#1b1b22',
        'accent': '#7dcfff',
        'ui': 'AMS MANAGEMENT DASHBOARD:\nRole: Admin Guard | Active Session: Teacher\nAttendance Marked Today: 142 / 150 Students (94.6%)',
        'flow': 'SECURITY & REPORTING FLOW:\nClass Check-in -> RBAC Role Verification -> Attendance Log DB -> Daily Automated Email Summary Cron',
        'data': 'RBAC SECURITY ROLES:\n- Admin: Full System Access & Audit Logs\n- Teacher: Class Roster & Attendance Mark\n- Student: View Personal Attendance History'
    },
    {
        'slug': 'ai-chatbot',
        'title': 'Conversational AI ChatBot Platform',
        'tags': 'Python | Gen AI | REST APIs',
        'bg': '#1c1b26',
        'accent': '#f7768e',
        'ui': 'CONVERSATIONAL CHATBOT ENGINE:\nUser: "How do I integrate the API widget?"\nAI Stream: "To embed the chatbot, add script tag to head..."',
        'flow': 'TOKEN STREAMING PIPELINE:\nUser Input -> Memory Manager -> OpenAI Stream Streamer -> Server-Sent Events (SSE) -> UI Widget',
        'data': 'SYSTEM CAPABILITIES:\n- Multi-turn Memory Context\n- Real-Time Token Streaming\n- Embeddable JS Widget (< 15KB)'
    },
    {
        'slug': 'classic-piano',
        'title': 'Classic Web Piano Synthesizer',
        'tags': 'JavaScript | Web Audio API | DSP',
        'bg': '#241b2c',
        'accent': '#e0af68',
        'ui': 'WEB PIANO SYNTHESIZER UI:\nActive Key: A4 (440.00 Hz) | Waveform: Triangle\nADSR Envelope: Attack 0.05s | Decay 0.2s | Sustain 0.8 | Release 1.2s',
        'flow': 'DSP AUDIO PIPELINE:\nKeydown Event -> AudioContext OscillatorNode -> GainNode ADSR Envelope -> AudioDestination (Speakers)',
        'data': 'AUDIO DSP SPECIFICATIONS:\n- Polyphony: 16 Simultaneous Voices\n- Latency: < 5ms Audio Buffer\n- Keyboard Shortcuts: QWERTY Row 1 & 2'
    },
    {
        'slug': 'bilingual-calendar',
        'title': 'Bilingual Calendar & Event System',
        'tags': 'JavaScript | Localization | CSS3',
        'bg': '#1b2622',
        'accent': '#73daca',
        'ui': 'BILINGUAL CALENDAR VIEW (English / हिंदी):\nSelected Date: 25 July 2026 / 25 जुलाई 2026\nEvents Scheduled: 3 Upcoming Meetings',
        'flow': 'LOCALIZATION ENGINE FLOW:\nLanguage Toggle (en/hi) -> Locale Dictionary Lookup -> Dynamic DOM Text Re-render -> Event Refresh',
        'data': 'LOCALIZATION FEATURES:\n- Languages: English (en-US) & Hindi (hi-IN)\n- LocalStorage Persistent Event Storage\n- Responsive Month / Week / Daily Schedule Views'
    }
]

for p in projects:
    for slide_type, text in [('ui', p['ui']), ('flow', p['flow']), ('data', p['data'])]:
        img = Image.new('RGB', (1200, 750), color=p['bg'])
        draw = ImageDraw.Draw(img)
        
        # Top Window Control Bar
        draw.rectangle([0, 0, 1200, 55], fill='#0c0b10')
        draw.ellipse([24, 18, 38, 32], fill='#ff5f56')
        draw.ellipse([48, 18, 62, 32], fill='#ffbd2e')
        draw.ellipse([72, 18, 86, 32], fill='#27c93f')
        draw.text((100, 16), f"CONFIDENTIAL FILE // {p['title'].upper()} [{slide_type.upper()}]", fill='#888888')
        
        # Outer Glass Container
        draw.rectangle([35, 80, 1165, 715], outline=p['accent'], width=3)
        
        try:
            font_head = ImageFont.truetype('arial.ttf', 32)
            font_sub = ImageFont.truetype('arial.ttf', 22)
            font_body = ImageFont.truetype('arial.ttf', 20)
        except:
            font_head = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            font_body = ImageFont.load_default()

        draw.text((70, 115), p['title'].upper(), fill='#ffffff', font=font_head)
        draw.text((70, 170), f"TAGS: {p['tags']}  |  DEVELOPER: ANUJ YADAV", fill=p['accent'], font=font_sub)
        
        # Content box
        draw.rectangle([70, 220, 1130, 675], fill='#07060a', outline='#333333')
        draw.text((95, 250), text, fill='#e2e8f0', font=font_body)

        out_path = f"public/assets/projects/{p['slug']}-{slide_type}.png"
        img.save(out_path)
        print(f"Generated visual slide: {out_path}")

print("All 21 interactive visual slides created successfully!")
