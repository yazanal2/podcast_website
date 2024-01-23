from flask import Blueprint, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
import requests
from werkzeug.utils import secure_filename
from . import db
from .models import Podcast, Question
import os
import audio_metadata
from tbm_utils import humanize_duration, humanize_filesize

views = Blueprint('views', __name__)

UPLOAD_FOLDER = 'website/static/podcast/'
ALLOWED_EXTENSIONS = {'mp3'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@views.route('/', methods=['GET', 'POST'])
def home():
    podcasts = Podcast.query.all()
    return render_template("home.html", user=current_user, podcast_list=podcasts)


@views.route('/podcast/episode/<int:episode>', methods=['GET', 'POST'])
def podcast(episode):
    podcast = Podcast.query.filter_by(id=episode).first()
    if podcast:
        return render_template("podcast.html", user=current_user, podcast=podcast)
    else:
        flash("Die Podcast Folge existiert nicht", category='error')
        return redirect(url_for('views.home'))


@views.route('/subscribe', methods=['GET', 'POST'])
def subscribe():
    return render_template("subscribe.html", user=current_user)


@views.route('/ask', methods=['GET', 'POST'])
@login_required
def ask():
    if request.method == 'POST':
        name = request.form.get('name')
        question = request.form.get('question')

        if name == '':
            flash('Kein Name eingetragen', category='error')
            return redirect(request.url)

        if question == '':
            flash('Keine Frage eingetragen', category='error')
            return redirect(request.url)

        new_question = Question(
            name=name, question=question, user=current_user.id)
        db.session.add(new_question)
        db.session.commit()

        flash('Frage gesendet')
        return redirect(request.url)

    else:
        return render_template("ask.html", user=current_user)


@views.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    role = current_user.role
    if role == 0:
        if request.method == 'POST':
            title = request.form.get('title')
            description = request.form.get('description')
            # check if the post request has the file part
            if 'file' not in request.files:
                flash('No file part', category='error')
                return redirect(request.url)
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                flash('No selected file', category='error')
                return redirect(request.url)

            if title == '':
                flash('No title', category='error')
                return redirect(request.url)

            if description == '':
                flash('No description', category='error')
                return redirect(request.url)

            if file and allowed_file(file.filename):
                folder = secure_filename(title)
                filename = secure_filename(file.filename)

                folder_path = os.path.join(os.getcwd(), UPLOAD_FOLDER, folder)
                file_path = os.path.join(folder_path, filename)

                if not os.path.exists(folder_path):
                    os.makedirs(folder_path)

                file.save(file_path)

                metadata = audio_metadata.load(file_path)
                filesize = humanize_filesize(metadata['filesize'])
                duration = humanize_duration(
                    metadata['streaminfo']['duration'])

                static_folder_path = os.path.join(folder, filename)

                new_podcast = Podcast(title=title, description=description,
                                      duration=duration, size=filesize, file_path=static_folder_path.replace('\\', '/'))
                db.session.add(new_podcast)
                db.session.commit()

                flash('Podcast uploaded')
                return redirect(request.url)
        else:
            return render_template("admin.html", user=current_user)
    else:
        flash("Nur Zugang für Admins", category='error')
        return redirect(url_for('views.home'))
