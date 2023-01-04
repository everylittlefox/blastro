import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useMemo, useState } from 'react'
import {
  View,
  Pressable,
  TextInput,
  Text,
  ScrollView,
  TextProps
} from 'react-native'
import { formatDate } from '../lib/helpers'
import { RootStackParamList } from '../navigation/stack'
import { LogProperty } from '../services/BlastroRepoService'

type Props = NativeStackScreenProps<RootStackParamList, 'create-update-log'>

export default function CreateUpdateLogScreen({ route, navigation }: Props) {
  const blastroLog = route.params.blastroLog
  const entry = route.params.entry
  const [content, setContent] = useState(entry?.content)

  const entryPropertyValues = useMemo(() => {
    return entry?.properties
      ? Object.keys(entry.properties).map((prop) => {
          const type = blastroLog.properties.find((p) => p.name === prop)?.type

          if (type)
            return {
              type,
              value: evaluateValue(type, entry.properties[prop]),
              name: prop
            }

          return null
        })
      : blastroLog.properties.map(({ name, defaultValue, type }) => {
          return {
            name,
            type,
            value: defaultValue ? evaluateValue(type, defaultValue) : ''
          }
        })
  }, [entry?.properties, blastroLog.properties])
    ?.filter(Boolean)
    .map((epv) => epv!)

  useEffect(() => {
    navigation.setOptions(
      entry?.title
        ? {
            headerTitle: (props) => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={{ color: 'gray' }}>{blastroLog.title}/</Text>
                  <Text style={{ fontSize: 18 }}>{entry.title}</Text>
                </View>
              )
            }
          }
        : { title: `new ${blastroLog.title}` }
    )
  }, [blastroLog.title, entry?.title])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 48,
        paddingHorizontal: 18
      }}
    >
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        {entryPropertyValues &&
          entryPropertyValues.map(({ name, value }) => (
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: 'lightgray',
                paddingVertical: 4,
                paddingHorizontal: 6,
                borderRadius: 4,
                flexDirection: 'row'
              }}
              key={`prop-${name}`}
            >
              <Text style={{ color: 'gray' }}>{name}</Text>
              <PropertyValueText value={value} style={{ paddingLeft: 8 }} />
            </Pressable>
          ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          style={{
            paddingVertical: 20,
            fontSize: 18,
            fontFamily: 'EBGaramond_400Regular'
          }}
          value={content}
          onChangeText={setContent}
          placeholder="body"
          multiline
        />
      </ScrollView>
    </View>
  )
}

type Value<T extends LogProperty['type']> = T extends 'date'
  ? Date
  : T extends 'string'
  ? string
  : number

const evaluateValue = <T extends LogProperty['type'] = 'date'>(
  type: T,
  value: string
): Value<T> => {
  switch (type) {
    case 'date':
      return (value === 'now()' ? new Date() : new Date(value)) as Value<T>

    default:
      return value as Value<T>
  }
}

const PropertyValueText = ({
  value,
  ...props
}: TextProps & { value: string | number | Date }) => {
  const v = value instanceof Date ? formatDate(value) : value.toString()
  return <Text {...props}>{v}</Text>
}
