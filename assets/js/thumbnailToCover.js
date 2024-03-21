window.onload = function() {
    var thumbnails = document.querySelectorAll('.project-thumbnail');
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            var projectId = this.id;
            var projectData = window.projectsData.find(project => project.id === projectId);
            if (projectData) {
                document.querySelector('#project-cover img').src = this.querySelector('img').src;
                document.querySelector('#project-title').textContent = this.querySelector('figcaption h4').textContent;
                document.querySelector('#project-description').textContent = projectData.description;
            } else {
                console.error('No project data found for ID:', projectId);
            }
        });
    });
};