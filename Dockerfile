#BaseImage
FROM nginx

# copyig files to html directory
COPY . /usr/share/nginx/html