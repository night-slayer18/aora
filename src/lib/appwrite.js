import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '67319a990025fc31ea2f',
    databaseId: '67319e9b0029b2dc82ce',
    userCollectionId: '67319ec1002f562fd9a8',
    videoCollectionId: '67319f13003e7ca04d0b',
    storageId: '6731a3f20015ac9d826e'
}

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) 
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email,password,username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) {
            throw new Error('Failed to create new account');
        }
        const avatarUrl = avatars.getInitials(username);
        await SignIn(email,password);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        )
        if (!newUser) {
            throw new Error('Failed to create new user');
        }
        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const SignIn = async (email,password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        if (!session) {
            throw new Error('Failed to create new session');
        }
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) {
            throw new Error('Failed to get current account');
        }
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) {
            throw new Error('Failed to get current user');
        }
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        if (!posts) {
            throw new Error('Failed to get posts');
        }
        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
        )
        if (!posts) {
            throw new Error('Failed to get posts');
        }
        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.search('title',query)]
        )
        if (!posts) {
            throw new Error('Failed to get posts');
        }
        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            [Query.equal('creator',userId)]
        )
        if (!posts) {
            throw new Error('Failed to get posts');
        }
        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        if (!session) {
            throw new Error('Failed to delete session');
        }
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if(type === 'image') {
            fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId,2000,2000,'top',100);
        } else if (type === 'video') {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        }
        else {
            throw new Error('Invalid file type');
        }
        if (!fileUrl) {
            throw new Error('Failed to get file preview');
        }
        return fileUrl;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const uploadFIle = async (file, type) => {
    if (!file) {
        return
    }
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri
    };
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset,
        );
        if (!uploadedFile) {
            throw new Error('Failed to upload file');
        }
        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl,videoUrl] = await Promise.all([
            uploadFIle(form.thumbnail, 'image'),
            uploadFIle(form.video, 'video')
        ])
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                video: videoUrl,
                thumbnail: thumbnailUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )
        if (!newPost) {
            throw new Error('Failed to create new video');
        }
        return newPost;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}