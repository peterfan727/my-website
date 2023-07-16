// 'use client';

// import Timeline from '@mui/lab/Timeline';
// import TimelineItem from '@mui/lab/TimelineItem';
// import TimelineSeparator from '@mui/lab/TimelineSeparator';
// import TimelineConnector from '@mui/lab/TimelineConnector';
// import TimelineContent from '@mui/lab/TimelineContent';
// import TimelineDot from '@mui/lab/TimelineDot';
// import TimelineOppositeContent  from '@mui/lab/TimelineOppositeContent';
import Position from './position';
import { Experiences } from './experiences';

export default function MuiTimeline () {
    // return (
    //     <Timeline className='w-full'>
    //         {Experiences.map( (value, idx, arr) => {
    //             const len = arr.length
    //             return (
    //             <TimelineItem 
    //                 key={value.startDate+value.jobTitle} >
    //                 <TimelineOppositeContent className='flex-initial'>
    //                     <h4>{value.startDate}</h4><strong>{value.duration}</strong>
    //                 </TimelineOppositeContent>
    //                 <TimelineSeparator>
    //                     <TimelineDot /> 
    //                     { idx < len -1 ? <TimelineConnector /> : null}
    //                 </TimelineSeparator>
    //                 <TimelineContent>
    //                     <Position {...value}/>
    //                 </TimelineContent>
    //             </TimelineItem>)
    //         })}
    //     </Timeline>
    // )
    return (
        Experiences.map( (value, idx, arr) => {
            const len = arr.length
            return (
                <Position key={value.startDate+value.jobTitle} {...value}/>
            )
        })
    )
}