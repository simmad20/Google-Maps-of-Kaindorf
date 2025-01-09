export interface ITeacher {
    id: number
    firstname: string
    lastname: string
    abbreviation: string
    image_url: string
    title: string
}

export interface IFeedback {
    id: number
    feedback: Feedback
}

export type Feedback = 'GOOD' | 'MID' | 'BAD';
