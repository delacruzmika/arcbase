from flask import Flask, render_template, request, redirect, session, jsonify
import mysql.connector
import hashlib
import os

app = Flask(__name__)
app.secret_key = 'arcbase_secret_key'

def get_db():
    return mysql.connector.connect(
        host=os.environ.get("MYSQLHOST"),
        user=os.environ.get("MYSQLUSER"),
        password=os.environ.get("MYSQLPASSWORD"),
        database=os.environ.get("MYSQLDATABASE"),
        port=int(os.environ.get("MYSQLPORT", 3306))
    )

def hash_password(pw):
    return hashlib.sha256(pw.encode()).hexdigest()

# ── REGISTER  (CREATE) ───────────────────────
@app.route('/register', methods=['GET', 'POST'])
def register():
    message = None
    status  = "error"

    if request.method == 'POST':
        username     = request.form.get('username', '').strip()
        email        = request.form.get('email', '').strip()
        raw_password = request.form.get('password', '').strip()
        role         = request.form.get('role', 'client').strip()

        if role not in ('client', 'admin'):
            role = 'client'

        if not username or not email or not raw_password:
            message = "All fields are required."
        elif len(raw_password) < 6:
            message = "Password must be at least 6 characters long."
        else:
            password = hash_password(raw_password)
            db = get_db()
            cursor = db.cursor()
            try:
                cursor.execute(
                    'INSERT INTO users (username, email, password, role) VALUES (%s, %s, %s, %s)',
                    (username, email, password, role)
                )
                db.commit()
                message = 'Account created successfully! You can now log in.'
                status  = "success"
            except mysql.connector.Error:
                message = 'Username or email already exists.'

    return render_template('register.html', message=message, status=status)

# ── LOGIN  (READ) ────────────────────────────
@app.route('/login', methods=['GET', 'POST'])
@app.route('/', methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        username     = request.form.get('username')
        raw_password = request.form.get('password')
        password     = hash_password(raw_password)

        db = get_db()
        cursor = db.cursor()
        cursor.execute(
            'SELECT id, username, email, role FROM users '
            'WHERE (username=%s OR email=%s) AND password=%s',
            (username, username, password)
        )
        user = cursor.fetchone()

        if user:
            session['user_id']  = user[0]
            session['username'] = user[1]
            session['email']    = user[2]
            session['role']     = user[3]
            return redirect('/admin' if user[3] == 'admin' else '/dashboard')
        else:
            error = 'Invalid email or password. Please try again.'

    return render_template('login.html', error=error)

# ── CLIENT DASHBOARD ─────────────────────────
@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect('/login')
    if session.get('role') == 'admin':
        return redirect('/admin')
    return render_template(
        'dashboard.html',
        username=session['username'],
        email=session.get('email', '')
    )

# ── ADMIN DASHBOARD ──────────────────────────
@app.route('/admin')
def admin():
    if 'user_id' not in session:
        return redirect('/login')
    if session.get('role') != 'admin':
        return redirect('/dashboard')
    return render_template('admin/index.html', username=session['username'])

# ── UPDATE PROFILE  (UPDATE) ─────────────────
@app.route('/update_profile', methods=['POST'])
def update_profile():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in.'}), 401

    data     = request.get_json()
    username = data.get('username', '').strip()
    email    = data.get('email', '').strip()
    phone    = data.get('phone', '').strip()

    if not username or not email:
        return jsonify({'success': False, 'message': 'Name and email are required.'})

    db     = get_db()
    cursor = db.cursor()
    try:
        cursor.execute(
            'UPDATE users SET username=%s, email=%s, phone=%s WHERE id=%s',
            (username, email, phone, session['user_id'])
        )
        db.commit()
        session['username'] = username
        session['email']    = email
        return jsonify({'success': True})
    except mysql.connector.Error as e:
        if e.errno == 1062:
            return jsonify({'success': False, 'message': 'That email is already in use.'})
        return jsonify({'success': False, 'message': 'Database error. Please try again.'})

# ── UPDATE PASSWORD  (UPDATE) ────────────────
@app.route('/update_password', methods=['POST'])
def update_password():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in.'}), 401

    data             = request.get_json()
    current_password = hash_password(data.get('current_password', ''))
    new_password     = data.get('new_password', '')

    if len(new_password) < 6:
        return jsonify({'success': False, 'message': 'Password must be at least 6 characters.'})

    db     = get_db()
    cursor = db.cursor()
    cursor.execute(
        'SELECT id FROM users WHERE id=%s AND password=%s',
        (session['user_id'], current_password)
    )
    if not cursor.fetchone():
        return jsonify({'success': False, 'message': 'Current password is incorrect.'})

    cursor.execute(
        'UPDATE users SET password=%s WHERE id=%s',
        (hash_password(new_password), session['user_id'])
    )
    db.commit()
    return jsonify({'success': True})

# ── DELETE ACCOUNT  (DELETE) ─────────────────
@app.route('/delete_account', methods=['POST'])
def delete_account():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in.'}), 401

    db     = get_db()
    cursor = db.cursor()
    cursor.execute('DELETE FROM users WHERE id=%s', (session['user_id'],))
    db.commit()
    session.clear()
    return jsonify({'success': True})

# ── LOGOUT ───────────────────────────────────
@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

if __name__ == "__main__":
    app.run(debug=False)
