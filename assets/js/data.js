window.onload = function() {
    fetch('./assets/js/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            return response.json(); // parse the JSON from the response
        })
        .then(projects => {
            // Store the projects data
            window.projectsData = projects; // store the data in the window object so it can be accessed from other scripts

            // Load the data from the first project
            var firstProjectData = projects[0];         
            
            // Set initial project info from JSON
            document.querySelector('#project-title').textContent = firstProjectData.title;
            document.querySelector('#project-description').textContent = firstProjectData.description;
            //Set initial tech list from JSON
            var techList = document.querySelector('.tech-list');
            firstProjectData.tech.forEach(function(tech) {
                var li = document.createElement('li');
                li.textContent = tech;
                techList.appendChild(li);
            });

            // Set up event listeners
            var thumbnails = document.querySelectorAll('.project-thumbnail');

            thumbnails.forEach(function(thumbnail) {
                
                thumbnail.addEventListener('click', function() {
                    var projectId = this.id;
                    var projectData = window.projectsData.find(project => project.id === projectId);
                    
                    if (projectData) {

                        var currentCover = document.querySelector('.project-cover img');
                        var thumbnailImgSrc = this.querySelector('img').src;

                        if (currentCover.src === thumbnailImgSrc) {
                            // The user clicked on the thumbnail of the currently displayed project
                            currentCover.classList.add('active');
                            setTimeout(function() {
                                currentCover.classList.remove('active');
                            }, 300); //pulse fades after 300ms

                        } else {
                            // The user clicked on a different project thumbnail
                            currentCover.style.opacity = 0;
                            setTimeout(function() {
                                currentCover.src = thumbnailImgSrc;
                                setTimeout(function() {
                                    currentCover.style.opacity = 1;
                                }, 66);
                            }, 66);

                            // update project title and description
                            document.querySelector('#project-title').textContent = this.querySelector('figcaption h4').textContent;
                            document.querySelector('#project-description').textContent = projectData.description;

                            // update project tech list
                            var techList = document.querySelector('.tech-list');
                            techList.innerHTML = ''; // clear the current tech list
                            projectData.tech.forEach(function(tech) {
                                var li = document.createElement('li');
                                li.textContent = tech;
                                techList.appendChild(li);
                            });
                        }

                    } else {
                        console.error('No project data found for ID:', projectId);
                    }
                });
            });
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};