type PrimaryButtonProps = {
    label: string,
    onclick?: () => void,
    children?: React.ReactNode
}

export const PrimaryButton = ({label, onclick, children}: PrimaryButtonProps) => {
    return(
        <div>
            <button 
            className="border rounded-xl w-48 h-14 
            flex justify-center items-center 
            cursor-pointer">
                {label}
            </button>
        </div>
    )
}