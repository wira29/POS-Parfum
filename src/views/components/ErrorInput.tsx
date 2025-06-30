export default function ErrorInput({error}:{error?:string|null}) {
    return (
        error && <div className="text-red-500 text-xs">{error}</div>
    )
}