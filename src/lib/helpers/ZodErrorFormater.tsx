export const FormatError = (errors: { path: string[]; message: string }[]) => {
    const reformatted: Record<string, string[]> = {};
    
    errors.forEach((error) => {
        error.path.forEach((field) => {
        if (!reformatted[field]) {
            reformatted[field] = [];
        }
        reformatted[field].push(error.message);
        });
    });
    
    return reformatted;
}