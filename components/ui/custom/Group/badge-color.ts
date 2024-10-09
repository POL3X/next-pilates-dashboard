export const badgeColor = (users: number, maxUsers:number) => {
    const size = maxUsers - users
    if(size <= 0 ){
      return "border-red-500 text-red-500"
    }
    else if(size == maxUsers){
      return "border-green-500 text-green-500"  
    }
      else if(size > 0 && size < 3){
      return "border-orange-500 text-orange-500"
    }
    return "border-green-500 text-green-500"
  }