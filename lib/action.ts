import {
    createProjectMutation,
    createUserMutation,
    deleteProjectMutation,
    getProjectByIdQuery,
    getProjectsOfUserQuery,
    getUserQuery,
    projectsQuery,
    updateProjectMutation,
} from "@/graphql";
import { ProjectForm } from "@/typing";
import { GraphQLClient } from "graphql-request";
const isProduction = process.env.NODE_ENV === "production";

const apiUrl = isProduction
    ? process.env.NEXT_PUBLIC_GRAFBASE_API_URl!
    : "http://127.0.0.1:4000/graphql";

const apiKey = isProduction
    ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY!
    : "letmein";
const serverUrl = isProduction
    ? process.env.NEXT_PUBLIC_URL!
    : "http://localhost:3000";

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables);
    } catch (error) {
        console.log(error, "ACTION_MAKE_GRAPH-QL-REQUEST_ERROR");
        throw error;
    }
};

export const getUser = (email: string) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getUserQuery, { email });
};

export const createUser = (name: string, email: string, avatarUrl: string) => {
    client.setHeader("x-api-key", apiKey);
    const variables = {
        input: { name, email, avatarUrl },
    };
    return makeGraphQLRequest(createUserMutation, variables);
};

export const fetchToken = async () => {
    try {
        const res = await fetch(`${serverUrl}/api/auth/token`);
        return res.json();
    } catch (error) {
        throw error;
    }
};

export const uploadImage = async (imagePath: string) => {
    try {
        return await fetch(`${serverUrl}/api/upload`, {
            method: "POST",
            body: JSON.stringify({ path: imagePath }),
        }).then((res) => res.json());
    } catch (error: any) {
        console.log("UPLOAD IMAGE ERROR");
        throw error;
    }
};

export const createNewProject = async (
    form: ProjectForm,
    creatorId: string,
    token: string
) => {
    // console.log(form, creatorId, token);

    const imageUrl: any = await uploadImage(form.image);
    // console.log(imageUrl);

    if (imageUrl?.url!) {
        client.setHeader("authorization", `Bearer ${token}`);
        client.setHeader("x-api-key", apiKey);
        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: { link: creatorId },
            },
        };
        // console.log(variables);

        return makeGraphQLRequest(createProjectMutation, variables);
    }
};

export const fetchAllProjects = async (
    category?: string,
    endCursor?: string
) => {
    client.setHeader("x-api-key", apiKey);

    return makeGraphQLRequest(projectsQuery, { category, endCursor });
};

export const getProjectDetails = (id: string) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id: string, last?: number) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = (id: string, token: string) => {
    client.setHeader("x-api-key", apiKey);
    client.setHeader("authorization", `Bearer ${token}`);
    return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (
    form: ProjectForm,
    projectId: string,
    token: string
) => {
    function isBase64DataURL(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }
    let updatedForm = { ...form };
    const isUploadingNewImage = isBase64DataURL(form.image);
    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);
        if (imageUrl?.url) {
            updatedForm = { ...form, image: imageUrl.url };
        }
    }
    const variables = {
        id: projectId,
        input: updatedForm,
    };
    console.log(variables);

    client.setHeader("x-api-key", apiKey);
    client.setHeader("authorization", `Bearer ${token}`);

    return makeGraphQLRequest(updateProjectMutation, variables);
};
