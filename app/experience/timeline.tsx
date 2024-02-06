import Position from './position'
import { Experiences } from './experiences'

/**
 * A component that renders a timeline of positions. Basically a flat list.
 * @returns JSX.Element
 */
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