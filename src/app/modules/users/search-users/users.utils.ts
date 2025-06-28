import { Injectable } from '@angular/core';
import { CAccountStatus, CBankAccountStatus } from '@pages/users/search-users/models/constants/accountStatus.constants';
import { DiscordStatus, IdentityStatus, IdentityTypeVerification } from '@pages/users/search-users/models/constants/status.constants';
import { ISearchUserResponse, IUserAgeVerificationData, IUserDiscordData, IUsersForTable, IUserTableDiscord, IUserTableIdentity, IUserYotiSessionsDataResponse, IUserYotiSessionsDataTable } from '@pages/users/search-users/models/interfaces/searchUsers.interface';
import { DateTime } from 'luxon';


@Injectable({
  providedIn: 'root'
})
export class UsersUtils {

  transformDataSearched(users:ISearchUserResponse[]):IUsersForTable[]{
    return users.map(user => {

      const newUser:IUsersForTable = {
        uuid:user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountCreated: DateTime.fromISO(user.created_at).toFormat('MM-dd-yyyy'),
        accountDeleted: DateTime.fromISO(user.created_at).toFormat('MM-dd-yyyy'),
        web3_address:user.web3_address,
        discord: this.transformDiscordData(user.discord_data),
        identity: this.transformIdentityData(user.age_verification_data,user.yoti_sessions),
        roles: user.roles?.join(',') || '',
        mbx_balance: user.mbx_balance || '0',
        accountStatus:  user.deletion_status || CAccountStatus.ACTIVE,
        bankAccountStatus: user.bank_account_status || CBankAccountStatus.ENABLED,
      }
      return newUser
    })
  }

  transformDiscordData(discordData:IUserDiscordData):IUserTableDiscord{
    return {
      connected:discordData ? DiscordStatus.CONNECTED : DiscordStatus.PENDING,
      userName:discordData ? discordData.username : '',
      id:discordData ? discordData.id : '',
      verified:discordData ? DateTime.fromISO(discordData.VerifiedAt).toFormat('MM-dd-yyyy') : '',
      created:discordData ? DateTime.fromISO(discordData.created_at).toFormat('MM-dd-yyyy') : '',
      discriminator:discordData ? discordData.discriminator : ''
    }
  }

  transformIdentityData(identityData:IUserAgeVerificationData,yotiSessions:IUserYotiSessionsDataResponse[]):IUserTableIdentity{
    return {
      verified:identityData ? IdentityStatus.VERIFIED : IdentityStatus.PENDING,
      type: identityData ? identityData.type : IdentityTypeVerification.PENDING,
      verifiedDate:identityData ? DateTime.fromISO(identityData.VerifiedAt).toFormat('MM-dd-yyyy') : '',
      sessions: identityData ? this.transformYotiSession(yotiSessions) : []
    }
  }

  transformYotiSession(yotiSessions:IUserYotiSessionsDataResponse[]):IUserYotiSessionsDataTable[]{
    if(!yotiSessions.length) return []

    return yotiSessions.map(session => {
        return {
          status: session.status,
          type:session.type,
          created: DateTime.fromISO(session.created).toFormat('MM-dd-yyyy')
        }
    })

  }

}
