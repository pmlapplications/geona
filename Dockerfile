#
#  This Dockerfile creates an image based on the contents of the current
#  folder; therefore the submodules have to be initalised and updated before 
#  the image is build. See docker-readme.md for full details
#
#  To obtain the latest image direct from the Docker Hub you can 
#  run `docker pull pmlrsg/gisportal` on the command line
#

FROM centos:latest

MAINTAINER "Ben Calton" <bac@pml.ac.uk>

RUN yum -y update && \
    yum clean all && \
    rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7 && \
    yum install -y epel-release gcc && \
    yum install -y nodejs \
        npm \
        git \
        wget \
        tar \
        redis \
        ruby \
        gdal \
        libjpeg-turbo \
        freetype-devel \
        libpng-devel \
        hdf5-devel \
        netcdf-devel \
        python-devel \
        python-pip \
        python-pillow-devel \
        python-requests \
        python-pandas \
        python-jinja2 \
        python-matplotlib && \
    rm -rf /usr/lib64/python2.7/site-packages/numpy* && \
    pip install numpy bokeh==0.12.7 owslib shapely netCDF4 && \
    npm install -g grunt-cli --silent && \
    gem install sass && \
    mkdir -p /opt/geona/config
 
ADD ./package.json /opt/geona/package.json

RUN cd /opt/geona && \
    npm install --silent

ADD . /opt/geona/

VOLUME /opt/geona/config

EXPOSE 6789
WORKDIR /opt/geona

CMD ["/opt/geona/docker-run.sh"]

