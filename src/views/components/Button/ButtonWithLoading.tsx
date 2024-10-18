
export const ButtonWithLoading = ({loading, children, className, type, disabled = false}:{loading: boolean, children: any, className: string, type: any, disabled?: boolean}) => {
    return (
        <button disabled={disabled} className={className} type={type}>
            {
                loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            }
            {
                loading ? "Loading..." : children
            }
        </button>
    )
}