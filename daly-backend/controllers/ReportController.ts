import { User } from "../interfaces/user";
import { getData, postData } from "./DatabaseController";
import { GetPlatform } from "./PlatformController";
import { GetQuiz } from "./QuizController";
import { GetUser } from "./UserController";

interface GetUserReportsParams{
    user: User
}
export async function GetUserReports({user}: GetUserReportsParams){
    let userData = await GetUser({user});
    let reports = await getData('reports', {ownerId: userData.id});
    return({reports})
}

interface CreateReportParams{
    reason: string
    description: string
    metadata: any
    user: User
}
export async function CreateReport({reason, description, metadata, user}: CreateReportParams){
    let userData = await GetUser({user});
    let ownerId = '0'

    async function getQuizOwner(quizId: string){
        let quizData = await GetQuiz({quizId: metadata.quizId});
        let platformData = await GetPlatform({platformId: quizData.platformId}); 
        return platformData.ownerId;
    }

    if(metadata.toStaff === false){
        switch(metadata.type){
            case 'comment':
                ownerId = await getQuizOwner(metadata.quizId);
                break;
            case 'quiz':
                ownerId = await getQuizOwner(metadata.quizId);
                break;
            default:
                break;
        }
    }
    let newReport = {
        reason, description, metadata,
        ownerId,
        reporterId: userData.id
    }
    let reportId = await postData('reports', newReport);
    return {reportId};
}
