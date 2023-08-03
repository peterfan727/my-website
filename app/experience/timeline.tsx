import Position from './position';
import { Experiences } from './experiences';

export default function Timeline () {
    return (
        Experiences.map( (value, idx, arr) => {
            const len = arr.length
            return (
                <Position key={value.startDate+value.jobTitle} {...value}/>
            )
        })
    )
}