export const dayNames = ['Lunes', 'Martes', 'Miércoles','Jueves','Viernes','Sabado','Domingo'
  ];

  export const dayNamesEn = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


  interface DaysTransformLabel{
    [key: string]: string 
  }

  export const daySpanishToEnglish: DaysTransformLabel  = {
    'lunes': 'monday',
    'martes': 'tuesday',
    'miércoles': 'wednesday',
    'jueves': 'thursday',
    'viernes': 'friday',
    'sábado': 'saturday',
    'domingo': 'sunday'
  };

  
  export const dayEnglishToSpanish: DaysTransformLabel  = {
    'monday': 'lunes',
    'tuesday': 'martes',
    'wednesday':'miercoles',
    'thursday':'jueves',
    'friday':'viernes',
    'saturday':'sábado',
    'sunday':'domingo'
  };              