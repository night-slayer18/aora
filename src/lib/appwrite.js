import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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