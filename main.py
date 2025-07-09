from flask import Flask,render_template,request

app = Flask(__name__)

@app.route('/')
def load_dashboard():
    return  render_template('security.html')

if __name__ == '__main__':
    app.run(debug=True)
