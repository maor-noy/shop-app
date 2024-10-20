import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {PRODUCTS} from '../../../assets/products'
import { ProductListItem } from '../../components/product-list-item'
import { ListHeader } from '../../components/list-header'

const Home = () => {
  //view is like a div in html, but it can't have text inside it directly
  return (
    <View> 
      <FlatList 
        data={PRODUCTS} 
        renderItem={({item})=> <ProductListItem product={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent }
        columnWrapperStyle={styles.flatListColumn}
        style={styles.flatList}
      />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  flatListContent: {
    paddingBottom: 20,
  },
  flatListColumn: {
    justifyContent: 'space-between'
  }
})