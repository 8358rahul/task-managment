import AsyncStorage from '@react-native-async-storage/async-storage'

const asyncStorage = {
  _storeData: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value)
      console.log('created')
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  },

  _storeDataAsJSON: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      // Error saving data
      console.log(error)
    }
  },

  _retrieveData: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        console.log('// We have data!! //')
        return value
      }
    } catch (error) {
      // Error retrieving data
      console.log(error)
    }
  },

  _removeData: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      // Error removing data
      console.log(error)
    }
  },

  _retrieveDataAsJSON: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        console.log('// We have data!! //')
        return JSON.parse(value)
      } else {
        return {}
      }
    } catch (error) {
      // Error retrieving data
      console.log(error)
    }
  }
}

export default asyncStorage
