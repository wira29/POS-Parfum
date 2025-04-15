
export const ButtonWithLoading = ({loading, children, disabled = false, ...prop}:{loading: boolean, children: any, className: string, type: any, disabled?: boolean, [key:string]:any}) => {
    return (
        <button disabled={disabled} {...prop}>
            {
                loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            }
            {
                loading ? "Loading..." : children
            }
        </button>
    )
}