let endpoint: string;

if (process.env.NODE_ENV == null || process.env.NODE_ENV === 'development') {
    endpoint = 'http://localhost:3000';
} else {
    endpoint ='';
};

export default endpoint;
