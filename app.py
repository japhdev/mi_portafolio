from flask import Flask, render_template, request, jsonify, g
from flask_mail import Mail, Message
import sqlite3
import json
from datetime import datetime
import os
import traceback
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Required environment variables verification
required_env_vars = ['GMAIL_USER', 'GMAIL_APP_PASSWORD']
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise RuntimeError(f"Missing required environment variables: {', '.join(missing_vars)}")

app = Flask(__name__)

# Flask-Mail configuration for Gmail
app.config.update(
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=587,
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.getenv('GMAIL_USER'),
    MAIL_PASSWORD=os.getenv('GMAIL_APP_PASSWORD'),
    MAIL_DEFAULT_SENDER=os.getenv('GMAIL_USER'),
    MAIL_DEBUG=False,
    SECRET_KEY=os.getenv('FLASK_SECRET_KEY', 'dev-key-for-development-environment'),
)

mail = Mail(app)

# Database configuration
DATABASE = 'messages.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

def init_db():
    with app.app_context():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='messages';")
        if not cursor.fetchone():
            cursor.execute('''
                CREATE TABLE messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    message TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            db.commit()
            print("✅ Database created successfully!")

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/test-smtp')
def test_smtp():
    try:
        with mail.connect() as conn:
            return "✅ SMTP connection successful with Gmail"
    except Exception as e:
        return f"❌ SMTP connection error: {str(e)}", 500

# Create backup directory if it doesn't exist
if not os.path.exists('message_backups'):
    os.makedirs('message_backups')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/certificados")
def certificados():
    return render_template("certificados.html")

def is_valid_email(email):
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@app.route('/enviar-formulario', methods=['POST'])
def handle_form():
    try:
        data = request.form
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()
        
        # Validations
        if not all([name, email, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400
            
        if not is_valid_email(email):
            return jsonify({'success': False, 'message': 'Please enter a valid email address'}), 400
        
        # Database operation
        try:
            db = get_db()
            cursor = db.cursor()
            cursor.execute(
                'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
                (name, email, message)
            )
            db.commit()
        except sqlite3.Error as db_error:
            print(f"❌ Database error: {db_error}")
            traceback.print_exc()
            return jsonify({'success': False, 'message': 'Error saving message'}), 500
        finally:
            if 'db' in locals():
                db.close()
        
        # Email sending
        try:
            msg = Message(
                subject=f"New contact message from {name}",
                recipients=[os.getenv('GMAIL_USER')],
                reply_to=email,
                body=f"""You have received a new message through your portfolio:

Name: {name}
Email: {email}
Date: {datetime.now().strftime('%d/%m/%Y at %H:%M')}

Message:
{message}

---
This message was sent automatically."""
            )
            mail.send(msg)
            print("✅ Email sent successfully")
        except Exception as mail_error:
            print(f"❌ Error sending email: {str(mail_error)}")
            traceback.print_exc()
        
        # JSON backup
        try:
            message_data = {
                'name': name,
                'email': email,
                'message': message,
                'timestamp': datetime.now().isoformat()
            }
            
            today = datetime.now().strftime('%Y-%m-%d')
            backup_file = f'message_backups/messages_{today}.json'
            
            with open(backup_file, 'a') as f:
                f.write(json.dumps(message_data) + '\n')
        except IOError as io_error:
            print(f"⚠️ Backup save error: {io_error}")
        
        return jsonify({
            'success': True,
            'message': 'Your message has been sent successfully. Thank you for contacting me!'
        })
    
    except Exception as e:
        print(f"❌ Error processing form: {e}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': 'An error occurred while processing your message. Please try again later.'
        }), 500

if __name__ == "__main__":
    init_db()
    app.run(debug=os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1', 't'))