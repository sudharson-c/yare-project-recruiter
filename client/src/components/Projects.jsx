// eslint-disable-next-line no-unused-vars
import React from 'react';
import ProjectCard from './ProjectCard';

const Projects = () => {
  const projects = [
    {
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },{
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },{
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },{
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },{
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },{
      imgSrc: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      membersOnly: "Members only",
      title: "Can coffee make you a better developer?",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.",
      authorImg: "https://tailwindcss.com/img/jonathan.jpg",
      authorName: "Jonathan Reinink",
      date: "Aug 18"
    },
    // Add more projects here as needed
  ];

  return (
    <div className="max-w-screen-xl mx-auto p-3 sm:p-7 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-10">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            id={index}
            imgSrc={project.imgSrc}
            membersOnly={project.membersOnly}
            title={project.title}
            description={project.description}
            authorImg={project.authorImg}
            authorName={project.authorName}
            date={project.date}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
