import click
import os
import sys
from app import create_app, db
from app.models import User, Post

app = create_app()

Cov = None
if os.environ.get('FLASK_COVERAGE'):
    import coverage
    COV = coverage.coverage(branch=True, include='app/*')
    COV.start()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': User, 'Post': Post}

@app.cli.command()
@click.option('--coverage/--no-coverage', default=False, help='Run test under code coverage.')
def test(coverage):
    '''Run the unit tests'''
    if coverage and not os.environ.get('FLASK_COVERAGE'):
        import subprocess
        os.environ['FLASK_COVERAGE'] = '1'
        sys.exit(subprocess.call(sys.argv))

    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)

    if COV:
        COV.stop()
        COV.save()
        print('Coverage Summary: ')
        COV.report()
        basedir = os.path.abspath(os.path.dirname(__file__))
        covdir = os.path.join(os.path.join(basedir, 'tmp'), 'coverage')
        COV.html_report(directory=covdir)
        print('')
        print('HTML report be store in :%s' % os.path.join(covdir, 'index.html')) 
        COV.erase()
