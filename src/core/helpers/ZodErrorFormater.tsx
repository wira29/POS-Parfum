export const FormatError = (errors: any) => {
    const reformatted = {};
    
    errors.forEach(error => {
        error.path.forEach(field => {
        if (!reformatted[field]) {
            reformatted[field] = [];
        }
        reformatted[field].push(error.message);
        });
    });
    
    return reformatted;
}