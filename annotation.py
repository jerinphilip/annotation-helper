import sqlite3
from flask import Flask, request, session, g, redirect, url_for,\
        abort, render_template, flash

from contextlib import closing

DATABASE = 'entries.db'
DEBUG = True
SECRET_KEY = 'devel key'
USERNAME = 'admin'
PASSWORD = 'password'


app = Flask(__name__)
app.config.from_object(__name__)


def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/entries')
def show_data():
    cursor = g.db.execute('select * from entries')
    entries = [dict(wid=row[0], word=row[1], split_word=row[2], split_location=row[3]) \
            for row in cursor.fetchall()]
    return render_template('show_data.html', entries=entries)

@app.route('/add', methods=['POST'])
def add_entry():
    if not session.get('logged_in'):
        abort(401)
    validate = ['word', 'split_word', 'split_location', 'lang']
    for v in validate:
        if not request.form[v]: 
            abort(400)
    values = [request.form[v] for v in validate]
    g.db.execute('insert into entries (word, split_word, split_location, lang) values (?, ?, ?, ?)', values)
    g.db.commit()
    return redirect(url_for('show_data'))

@app.route('/rules', methods=['POST'])
def add_rule():
    if not session.get('logged_in'):
        abort(401)
    validate = ['x', 'y', 'xt', 'yt', 'lang']
    #print validate
    values = [request.form[v] for v in validate]
    #print values
    g.db.execute('insert into rules (x, y, xt, yt, lang) values (?, ?, ?, ?, ?)', values)
    g.db.commit()
    return redirect(url_for('rule_editor'))

@app.route('/rules', methods=['GET'])
def rule_editor():
    cursor = g.db.execute('SELECT * from rules');
    rules = [dict(rid=row[0], 
        x=row[1], y = row[2], xt=row[3], yt=row[4], lang=row[5]) for row in cursor.fetchall()]
    return render_template('rule_editor.html', rules=rules)


@app.route('/add', methods=['GET'])
def add_entry_form():
    return render_template('add_entry.html')

@app.route('/editor', methods=['GET'])
def editor():
    cursor = g.db.execute('SELECT * from rules')
    rules = [dict(x=row[1], y=row[1], xt=row[2], yt=row[3]) \
            for row in cursor.fetchall()]
    
    #print rules
    return render_template('editor.html', rules=rules)



@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] != app.config['USERNAME']:
            error = 'Invalid username'
        elif request.form['password'] != app.config['PASSWORD']:
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            flash('You were logged in')
            return redirect(url_for('show_data'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('show_data'))

@app.route('/dump')
def dump():
    cursor = g.db.execute('select * from entries')
    entries = [dict(wid=row[0], word=row[1], split_word=row[2], split_location=row[3]) \
            for row in cursor.fetchall()]
    return render_template('dump.html', entries=entries);

if __name__ == '__main__':
    app.run(host='0.0.0.0')
