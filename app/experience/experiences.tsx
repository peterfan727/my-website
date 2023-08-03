export type Experience = {
    jobTitle: string,
    company: string,
    companyHref?: string,
    startDate: string,
    duration: string,
    tags: string[],
    jobDescription: string,
    techs: string[],
}

const gluxkind_2 = {
    jobTitle: "Machine Learning Intern",
    company: "Glüxkind Technologies Inc.",
    companyHref: "https://gluxkind.com",
    startDate: "May 2022",
    duration: "4 months",
    tags: [
        "AI", "Machine Learning", "Supervised Learning", "Computer Vision"
    ],
    jobDescription: 
        "Part of the development of the autonomous driving feature for a smart baby stroller. I contributed to the semantic segmentation machine learning model, planned and balanced AI training data, and automated the processing of terabytes of image data using Python and bash scripts. I also supervised the manual data labelling process and developed a user-presence detection model.",
    techs: ["Python", "PyTorch", "OpenCV", "AWS", "Linux"],
}

const gluxkind_1 = {
    jobTitle: "Software Engineering Intern",
    company: "Glüxkind Technologies Inc.",
    companyHref: "https://gluxkind.com",
    startDate: "May 2021",
    duration: "8 months",
    tags: [
        "Mobile App Development", "Embedded System", "Robotics", "Internet of Things (I.O.T.)" 
    ],
    jobDescription: "I independently developed a cross-platform mobile application using React Native and Node packages. I implemented a Bluetooth client API for the app and a Bluetooth server on the Arduino micro-controller firmware. I also added a new back-end feature on the ROS stack for logging system topics and assisted the mechatronics engineer in ROS navigation stack development.",
    techs: ["React Native", "JavaScript", "Arduino", "C++", "ROS", "Linux"],
}

export const Experiences = [gluxkind_2, gluxkind_1]
