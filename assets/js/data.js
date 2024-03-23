// Flag to check if the addProjects function has been called
var hasAddedProjects = false;
var currentProjectIndex = 0;

function addProjects(projectsData, currentProjectIndex=0) {
    // Get the project container
    var projectContainer = document.querySelector('.project-container');

    // Create a new array that starts from the next project after the current one
    var reorderedProjectsData = projectsData.slice(currentProjectIndex + 1).concat(projectsData.slice(0, currentProjectIndex + 1));

    // Loop through the projectsData array starting from the second project
    for (var i = 1; i < reorderedProjectsData.length; i++) {
        var projectData = reorderedProjectsData[i];

        // Create new elements for the project
        var projectArticle = document.createElement('article');
        // Assign classes
        projectArticle.className = 'project additional-project';

        //Create project figure and image
        var projectFigure = document.createElement('figure');
        projectFigure.className = 'project-cover';
        var projectImg = document.createElement('img');
        projectImg.src = projectData.coverImgSrc; // Set the src attribute to the coverImgSrc from the projectData
        projectFigure.appendChild(projectImg);

        // Project title, description, and tech list
        // Project title
        var projectTitle = document.createElement('h2');
        projectTitle.className = 'project-title';
        projectTitle.textContent = projectData.title;
        // Create a new div element for the project info
        var projectInfo = document.createElement('div');
        projectInfo.className = 'project-info';
        // Create a new p element for the project description
        var projectDescription = document.createElement('p');
        projectDescription.id = 'project-description';
        projectDescription.textContent = projectData.description;
        // Create a new ul element for the tech list
        var techList = document.createElement('ul');
        techList.className = 'tech-list';
        projectData.tech.forEach(function(tech) {
            var li = document.createElement('li');
            li.textContent = tech;
            techList.appendChild(li);
        });

        // Append the new elements to the project article
        projectArticle.appendChild(projectFigure);
        projectArticle.appendChild(projectTitle);
        projectArticle.appendChild(projectInfo);
        projectInfo.appendChild(projectDescription);
        projectInfo.appendChild(techList);

        // Append the project article to the project container
        projectContainer.appendChild(projectArticle);
    }
    console.log('Projects added to the page');
}

function removeProjects() {
    // Get the project container
    var projectContainer = document.querySelector('.project-container');

    // Get the additional projects
    var additionalProjects = document.querySelectorAll('.additional-project'); // Use the additional-project class

    // Loop through the additional projects and remove them
    additionalProjects.forEach(function(project) {
        projectContainer.removeChild(project);
    });

    console.log('Projects removed from the page');
}

function addCurrentProject() {
    // Get the id of the currently active project
    var activeProjectId = document.querySelector('.project.active').id;

    // Extract the project number from the id
    var projectNumber = parseInt(activeProjectId.replace('project-', ''));

    // The index of the project in the array is one less than the project number
    var currentProjectIndex = projectNumber - 1;

    // Call the addProjects function with the currentProjectIndex
    addProjects(projectsData, currentProjectIndex);

    // Set the hasAddedProjects flag to true
    hasAddedProjects = true;
}

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
            window.projectsData = projects;
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
            // Set the active class to the first project
            var firstProject = document.querySelector('.project');
            if (firstProject) {
                firstProject.classList.add('active');
            }

            // Set up event listeners
            var thumbnails = document.querySelectorAll('.project-thumbnail');

            // Loop through the thumbnails and add an event listener to each one
            thumbnails.forEach(function(thumbnail, index) {
                
                thumbnail.addEventListener('click', function() {
                    var projectId = this.id;
                    var projectData = window.projectsData.find(project => project.id === projectId);
                    
                    if (projectData) {
                        // Update the project cover image
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
                            // UPDATE PROJECT INFO
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
                            currentProjectIndex = index;
                        }

                    } else {
                        console.error('No project data found for ID:', projectId);
                    }

                });
            });

            // Check if the viewport is 767px or smaller
            if (window.matchMedia('(max-width: 767px)').matches) {
                addCurrentProject();
            }

            window.addEventListener('resize', function() {
                // Check if the viewport is larger than 767px
                if (window.matchMedia('(min-width: 768px)').matches) {
                    removeProjects();
                    // Set the hasAddedProjects flag to false
                    hasAddedProjects = false;
                } else {
                    // Only call the addProjects function if it hasn't been called yet
                    if (!hasAddedProjects) {
                        addCurrentProject();
                    }
                }
            });

        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
};

