import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useMemo } from 'react'
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
    navigation.setOptions({
      title: entry?.title
        ? `${blastroLog.title}/${entry.title}`
        : `new ${blastroLog.title}`
    })
  }, [blastroLog.title, entry?.title])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          padding: 18
        }}
      >
        <View style={{ flexDirection: 'row' }}>
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
        <TextInput
          style={{
            paddingVertical: 20,
            fontSize: 16
          }}
          value={entry?.content}
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
