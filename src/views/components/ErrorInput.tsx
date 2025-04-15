export default function ErrorInput({error}:{error?:string|null}) {
    return (
        error && <div className="text-danger">{error}</div>
    )
}