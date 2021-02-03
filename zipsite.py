#!/usr/bin/env python 

import os
import zipfile

def addfiles(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), os.path.relpath(os.path.join(root, file), os.path.join(path, "..")))

def addfile(reldir, path, ziph):
    ziph.write(os.path.realpath(path), os.path.relpath(os.path.realpath(path), os.path.realpath(reldir)))

if __name__ == '__main__':
    os.mkdir('./artifacts/')
    zipf = zipfile.ZipFile('./artifacts/charlie-coleman.com.zip', 'w', zipfile.ZIP_DEFLATED)
    addfiles('./404/', zipf)
    addfiles('./css/', zipf)
    addfiles('./downloadables/', zipf)
    addfiles('./experiments/', zipf)
    addfiles('./gray/', zipf)
    addfiles('./js/', zipf)
    addfiles('./osrs/', zipf)
    addfiles('./resources/', zipf)
    addfiles('./schedule/', zipf)
    addfiles('./trusty/', zipf)
    addfiles('./trusty48/', zipf)
    addfile('./', './index.html', zipf)
    zipf.close()
