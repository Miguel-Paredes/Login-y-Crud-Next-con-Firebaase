import { inter } from "@/config/Fonts"

interface Props {
    title: string
}

export const Title = ( { title } : Props) => {
    return(
        <h1 className={`${inter.className} antialiased font-semibold text-3xl pt-5 text-center`}>
            {title}
        </h1>
    )
}