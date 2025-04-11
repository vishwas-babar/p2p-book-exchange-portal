

export const BackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


function validateEnvs() {
    if (!BackendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
    }
}

validateEnvs();