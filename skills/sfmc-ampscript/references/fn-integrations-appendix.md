# AMPscript Integrations & Appendix Functions

This reference covers the niche AMPscript function families: the Marketing Cloud Engagement SOAP API object functions, Contact management, SMS/MMS/MobileConnect, Social, Microsoft Dynamics CRM (MSCRM), Salesforce Sales Cloud & Service Cloud, and the authenticated-user personalization functions. Support is shown as `Support: Engagement <flag> · Next <flag>` where ✅ means supported and ❌ means not supported. Every function in this file is Engagement-only (`Next ❌`). See [`function-index.md`](function-index.md) for the full navigation surface.

> Note: Where a source page describes an example only in prose (no fenced code block), the section is annotated with `> Example code not captured in source.` Do not invent example code.

---

## API Functions (SOAP API Objects)

Use these functions to interact with the Marketing Cloud Engagement SOAP API. An object created with `CreateObject()` persists for only one Invoke API call.

### AddObjectArrayItem

Support: Engagement ✅ · Next ❌

Adds an object to an array in a Marketing Cloud Engagement API object.

Parameters:
- `apiObject` (API Object) — Required. The API object that contains the array to modify.
- `arrayProperty` (string) — Required. The array property to receive the new item.
- `itemToAdd` (string) — Required. The item to add to the array.

> Example code not captured in source.

See also: CreateObject, SetObjectProperty

### CreateObject

Support: Engagement ✅ · Next ❌

Creates a Marketing Cloud Engagement API object.

Parameters:
- `objectName` (string) — Required. The name of the new API object.

> Example code not captured in source.

See also: SetObjectProperty, InvokeCreate

### InvokeCreate

Support: Engagement ✅ · Next ❌

Invokes the Create method on an API object and returns an API status code.

Parameters:
- `apiObject` (API Object) — Required. The API object to create.
- `statusMessage` (AMPscript variable) — Required. Variable that stores the API status message.
- `errorCode` (AMPscript variable) — Required. Variable that stores the API error code.
- `createOptionsObject` (API Object) — Optional. A CreateOptions API object.

> Example code not captured in source.

See also: CreateObject, InvokeUpdate

### InvokeDelete

Support: Engagement ✅ · Next ❌

Invokes the Delete method on an API object and returns the API status code. Use an ID, external ID, or key as the object reference.

Parameters:
- `apiObject` (API Object) — Required. The API object to delete.
- `statusMessage` (AMPscript variable) — Required. Variable that stores the API status message.
- `errorCode` (AMPscript variable) — Required. Variable that stores the API error code.
- `deleteOptionsObject` (API Object) — Optional. A DeleteOptions API object.

> Example code not captured in source.

See also: InvokeCreate, InvokeUpdate

### InvokeExecute

Support: Engagement ✅ · Next ❌

Invokes the Execute method on an API object.

Parameters:
- `apiObject` (API Object) — Required. The API object to execute.
- `statusMessage` (AMPscript variable) — Optional. Variable that stores the API status message.
- `requestId` (AMPscript variable) — Optional. Variable that stores the request ID.

> Example code not captured in source.

See also: InvokePerform, InvokeRetrieve

### InvokePerform

Support: Engagement ✅ · Next ❌

Invokes the Perform method on an API object.

Parameters:
- `apiObject` (API Object) — Required. The API object to invoke the Perform method on.
- `actionToPerform` (string) — Required. The action to perform; valid values vary by object type.
- `statusMessage` (AMPscript variable) — Optional. Variable that stores the API status message.

> Example code not captured in source.

See also: InvokeExecute, InvokeRetrieve

### InvokeRetrieve

Support: Engagement ✅ · Next ❌

Invokes the Retrieve method on an API object.

Parameters:
- `apiObject` (API Object) — Required. The API object to invoke the Retrieve method on.
- `statusMessage` (AMPscript variable) — Optional. Variable that stores the API status message.
- `requestId` (AMPscript variable) — Optional. Variable that stores the request ID.

> Example code not captured in source.

See also: InvokeExecute, InvokePerform

### InvokeUpdate

Support: Engagement ✅ · Next ❌

Invokes the Update method on an API object and returns an API status code.

Parameters:
- `apiObject` (API Object) — Required. The API object to update.
- `statusMessage` (AMPscript variable) — Optional. Variable that stores the API status message.
- `errorCode` (AMPscript variable) — Optional. Variable that stores the response error code, if one occurs.
- `updateOptions` (API Object) — Optional. An UpdateOptions API object.

> Example code not captured in source.

See also: InvokeCreate, InvokeDelete

### SetObjectProperty

Support: Engagement ✅ · Next ❌

Sets a value for an object created by the `CreateObject()` function.

Parameters:
- `apiObject` (API Object) — Required. The API object to set a value for.
- `propertyName` (string) — Required. The name of the property to assign a value to.
- `propertyValue` (string) — Required. The value to assign to the property.

> Example code not captured in source.

See also: CreateObject, AddObjectArrayItem

---

## Contact Functions

The only Contact function is `UpsertContact()`, used to create or update contact records.

### UpsertContact

Support: Engagement ✅ · Next ❌

Creates or updates a contact record. Upserts attributes that are part of the MobileConnect Data Attribute Group (standard fields such as `_FirstName`, `_LastName`, `_City`, and custom attributes).

Parameters:
- `channel` (string) — Required. The contact channel. The only supported value is `mobile`.
- `attribute` (string) — Required. The attribute to match the contact on. The only supported value is `phone`.
- `phoneNumber` (number) — Required. The contact's phone number, including the country code.
- `keyToUpsert1` (string) — Optional. The name of the attribute to upsert.
- `valueToUpsert1` (string) — Optional. The value of the attribute to upsert. Append more `keyToUpsertN`/`valueToUpsertN` pairs to upsert additional attributes.

Returns `0` when the operation completes with no errors.

> Example code not captured in source.

---

## SMS / MMS Functions (MobileConnect)

These functions are usable only in MobileConnect and not in email, landing pages, or other content types. Conversation functions can't be used with conversation-based templates (Double Opt-In, Info Capture). See also the MobileConnect MO-parsing constructs `Nouns`, `Noun()`, and `Verb` in [`language-guide.md`](language-guide.md).

### CreateSmsConversation

Support: Engagement ✅ · Next ❌

Creates an SMS conversation with a contact. Always returns `true` on success and raises an exception on failure, so it is not recommended for decision-making.

Parameters:
- `originationNumber` (string) — Required. The short or long code used in MobileConnect.
- `destinationNumber` (string) — Required. The contact's phone number, including the country code.
- `nextKeyword` (string) — Required. The string to set as the next conversation keyword.
- `app` (string) — Required. The application used in the conversation. Must be `MOBILECONNECT`; any other value results in an error.

> Example code not captured in source.

See also: EndSmsConversation, SetSmsConversationNextKeyword

### EndSmsConversation

Support: Engagement ✅ · Next ❌

Ends an active SMS conversation with a contact. Always returns `true` on success and raises an exception on failure.

Parameters:
- `originationNumber` (string) — Required. The short or long code used in MobileConnect.
- `destinationNumber` (string) — Required. The contact's phone number, including the country code.

> Example code not captured in source.

See also: CreateSmsConversation, SetSmsConversationNextKeyword

### SetSmsConversationNextKeyword

Support: Engagement ✅ · Next ❌

Sets the keyword for the next conversation path based on an SMS response, without initiating a new conversation. The keyword is applied when the contact sends the next message.

Parameters:
- `originationNumber` (string) — Required. The short or long code used in MobileConnect.
- `destinationNumber` (string) — Required. The contact's phone number, including the country code.
- `keyword` (string) — Required. The string to set as the next conversation keyword.

> Example code not captured in source.

See also: CreateSmsConversation, EndSmsConversation

### Msg

Support: Engagement ✅ · Next ❌

Returns the complete content of a mobile-originated (MO) message sent by a subscriber to your SMS phone number.

Parameters:
- `messageIndex` (integer) — Required. The only accepted value is `0`.

> Example code not captured in source.

See also: MMS_Content_URL, Nouns, Noun, Verb

### MMS_Content_URL

Support: Engagement ✅ · Next ❌

Returns the URL of MMS content sent from a mobile-originated (MO) message.

Parameters:
- `position` (integer) — Required. The zero-based index of the MMS content item to return the URL for (first item is `0`, second is `1`, and so on).

> Example code not captured in source.

See also: Msg, Nouns, Noun, Verb

---

## Social Functions

Use these functions to publish or share content on social networks. `GetPublishedSocialContent` is for use only in landing pages or the Social Forward feature.

### GetPublishedSocialContent

Support: Engagement ✅ · Next ❌

Returns content to share on a social network as specified by the region ID.

Parameters:
- `regionId` (string) — Required. The region ID for the social content area.

> Example code not captured in source.

See also: GetSocialPublishURL, GetSocialPublishURLByName

### GetSocialPublishURL

Support: Engagement ✅ · Next ❌

Returns a URL that shares a content region on a social network.

Parameters:
- `socialNetworkCode` (string) — Required. The name of the social network.
- `contentRegion` (string) — Required. The name of the content region to share.
- `socialNetworkParamKey` (string) — Optional. The key of a parameter to pass to the target social network.
- `socialNetworkParamValue` (string) — Optional. The value of a parameter to pass to the target social network. Append more key/value pairs as needed.

> Example code not captured in source.

See also: GetSocialPublishURLByName, GetPublishedSocialContent

### GetSocialPublishURLByName

Support: Engagement ✅ · Next ❌

Returns a URL that shares a content region on a social network, identified by social network name and country code.

Parameters:
- `socialNetworkName` (string) — Required. The name of the social network.
- `countryCode` (string) — Required. An ISO country code.
- `contentRegion` (string) — Required. The name of the content region to share.
- `socialNetworkParamKey` (string) — Optional. The key of a parameter to pass to the target social network.
- `socialNetworkParamValue` (string) — Optional. The value of a parameter to pass to the target social network. Append more key/value pairs as needed.

> Example code not captured in source.

See also: GetSocialPublishURL, GetPublishedSocialContent

---

## Microsoft Dynamics CRM (MSCRM) Functions

Use these functions to interact with a Microsoft Dynamics CRM instance integrated with Marketing Cloud Engagement.

### AddMscrmListMember

Support: Engagement ✅ · Next ❌

Adds a record to a Microsoft Dynamics CRM marketing list.

Parameters:
- `recordGuid` (string) — Required. The GUID of the record to add to the marketing list.
- `listGuid` (string) — Required. The GUID of the marketing list to add the record to.

> Example code not captured in source.

See also: CreateMscrmRecord, UpdateMscrmRecords

### CreateMscrmRecord

Support: Engagement ✅ · Next ❌

Creates a record in a Microsoft Dynamics CRM entity.

Parameters:
- `entityName` (string) — Required. The name of the Microsoft Dynamics CRM entity.
- `numFields` (number) — Required. The number of name/value field pairs to create.
- `attributeName1` (string) — Required. The name of the first attribute to populate.
- `attributeValue1` (string) — Required. The value of the first attribute to populate. Append more `attributeNameN`/`attributeValueN` pairs as needed.

> Example code not captured in source.

See also: UpdateMscrmRecords, UpsertMscrmRecord

### DescribeMscrmEntities

Support: Engagement ✅ · Next ❌

Returns the logical and display names of all Microsoft Dynamics CRM entities.

Parameters:
- This function doesn't have any parameters.

> Example code not captured in source.

See also: DescribeMscrmEntityAttributes

### DescribeMscrmEntityAttributes

Support: Engagement ✅ · Next ❌

Retrieves information about the attributes of a Microsoft Dynamics CRM entity.

Parameters:
- `entityName` (string) — Required. The name of the entity to retrieve attributes from.

> Example code not captured in source.

See also: DescribeMscrmEntities

### RetrieveMscrmRecords

Support: Engagement ✅ · Next ❌

Retrieves data from Microsoft Dynamics CRM entities.

Parameters:
- `entityName` (string) — Required. The name of the entity to retrieve records from.
- `fieldsToRetrieve` (string) — Required. A comma-separated list of fields to retrieve.
- `queryFieldName` (string) — Required. The name of the field to filter on.
- `queryFieldOperator` (string) — Required. The operator to use for the filter.
- `queryFieldValue` (string) — Required. The value to filter on.

> Example code not captured in source.

See also: RetrieveMscrmRecordsFetchXml

### RetrieveMscrmRecordsFetchXml

Support: Engagement ✅ · Next ❌

Returns the attributes specified in a Fetch XML query.

Parameters:
- `fetchXmlQuery` (string) — Required. A Microsoft Dynamics CRM Fetch XML query.

> Example code not captured in source.

See also: RetrieveMscrmRecords

### SetStateMscrmRecord

Support: Engagement ✅ · Next ❌

Sets the state and status of a Microsoft Dynamics CRM record.

Parameters:
- `recordGuid` (string) — Required. The GUID of the record to set the state and status of.
- `entityName` (string) — Required. The name of the Microsoft Dynamics CRM entity.
- `stateToSet` (string) — Required. The state to set. Accepted values: `active` or `inactive`.
- `statusToSet` (string) — Required. The status to set. Accepted values: `0`, `1`, or `-1` (`-1` resets the status to its default).

> Example code not captured in source.

See also: UpdateMscrmRecords

### UpdateMscrmRecords

Support: Engagement ✅ · Next ❌

Updates one or more records in a Microsoft Dynamics CRM entity.

Parameters:
- `entityName` (string) — Required. The name of the entity that contains the records to update.
- `guidsToUpdate` (string) — Required. A comma-separated list of GUIDs to update.
- `attributeName1` (string) — Required. The name of the attribute to update.
- `attributeValue1` (string) — Required. The value to update on the target records. Append more `attributeNameN`/`attributeValueN` pairs as needed.

> Example code not captured in source.

See also: CreateMscrmRecord, UpsertMscrmRecord

### UpsertMscrmRecord

Support: Engagement ✅ · Next ❌

Retrieves a matching record and updates it, or creates a new record if none is found, in a Microsoft Dynamics CRM entity. Returns the GUID of the updated or created record.

Parameters:
- `entityName` (string) — Required. The name of the entity to upsert.
- `sortField` (string) — Required. The field to sort the retrieve results on.
- `sortType` (string) — Required. The sort order. Accepted values: `ASC` or `DESC`.
- `numPairsForRetrieve` (string) — Required. The number of name/value pairs used to retrieve results.
- `filterAttributeName` (string) — Required. The name of the attribute to filter the target entity by.
- `filterAttributeValue` (string) — Required. The value of the attribute to filter the target entity by.
- `numPairsForUpdate` (string) — Required. The number of name/value pairs used to update records.
- `updateAttributeName` (string) — Required. The name of the attribute to update.
- `updateAttributeValue` (string) — Required. The value of the attribute to update.

> Example code not captured in source.

See also: CreateMscrmRecord, UpdateMscrmRecords

---

## Salesforce Sales Cloud & Service Cloud Functions

These functions require Marketing Cloud Connect to integrate with Sales Cloud or Service Cloud. They issue SOAP requests to your Salesforce org; minimize their use in large sends to avoid failures.

### CreateSalesforceObject

Support: Engagement ✅ · Next ❌

Creates a record in a Sales Cloud or Service Cloud object and returns the ID of the created record.

Parameters:
- `objectName` (string) — Required. The API name of the Salesforce object to insert into.
- `numFields` (string) — Required. The number of fields to insert; must match the number of name/value pairs specified.
- `fieldName1` (string) — Required. The name of the field to insert.
- `fieldValue1` (string) — Required. The value to insert for the field. Append more `fieldNameN`/`fieldValueN` pairs as needed.

> Example code not captured in source.

See also: UpdateSingleSalesforceObject, RetrieveSalesforceObjects

### LongSFID

Support: Engagement ✅ · Next ❌

Converts a shortened (15-character) Salesforce ID to its long (18-character) form. Salesforce IDs sometimes appear in a case-sensitive 15-character form; the 18-character form is case-insensitive and required by some integrations.

Parameters:
- `shortSfid` (string) — Required. The 15-character Salesforce ID to convert to its 18-character form.

> Example code not captured in source.

See also: CreateSalesforceObject, RetrieveSalesforceObjects

### RetrieveSalesforceObjects

Support: Engagement ✅ · Next ❌

Retrieves information from a Sales Cloud or Service Cloud object.

Parameters:
- `objectName` (string) — Required. The API name of the Salesforce object to retrieve from.
- `fieldsToRetrieve` (string) — Required. A comma-separated list of fields to retrieve.
- `queryFieldName1` (string) — Required. The name of the field to filter on.
- `queryFieldOperator1` (string) — Required. The operator to use for the filter.
- `queryFieldValue1` (string) — Required. The value to filter on. Append more filter triples as needed.

> Example code not captured in source.

See also: CreateSalesforceObject, UpdateSingleSalesforceObject

### RetrieveSalesforceJobSources

Support: Engagement ✅ · Next ❌

Retrieves information about the sources of a Salesforce send job.

Parameters:
- `jobId` (number) — Required. The job ID of the Salesforce send to retrieve information about.

> Example code not captured in source.

See also: RetrieveSalesforceObjects

### UpdateSingleSalesforceObject

Support: Engagement ✅ · Next ❌

Updates a single field on a record in a Sales Cloud or Service Cloud object.

Parameters:
- `objectName` (string) — Required. The API name of the Salesforce object to update.
- `idToUpdate` (string) — Required. The ID of the record to update.
- `fieldName` (string) — Required. The name of the field to update.
- `fieldValue` (string) — Required. The value to assign to the named field.

> Example code not captured in source.

See also: CreateSalesforceObject, RetrieveSalesforceObjects

---

## Authenticated-User Personalization Functions

These functions return details about the current authenticated user. Use them only with Microsites when using Sender Authenticated Redirection — not with CloudPages. None of them accept parameters.

### AuthenticatedEmployeeID

Support: Engagement ✅ · Next ❌

Returns the employee ID of the current Marketing Cloud Engagement user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

### AuthenticatedEmployeeNotificationAddress

Support: Engagement ✅ · Next ❌

Returns the email address of the current Marketing Cloud Engagement user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

### AuthenticatedEmployeeUserName

Support: Engagement ✅ · Next ❌

Returns the username of the current Marketing Cloud Engagement user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

### AuthenticatedEnterpriseID

Support: Engagement ✅ · Next ❌

Returns the enterprise ID of the current authenticated landing page user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

### AuthenticatedMemberID

Support: Engagement ✅ · Next ❌

Returns the member ID of the authenticated landing page user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

### AuthenticatedMemberName

Support: Engagement ✅ · Next ❌

Returns the member name of the authenticated landing page user.

Parameters:
- This function doesn't accept any parameters.

> Example code not captured in source.

---

## Utility Cross-Reference

The personalization string families (recipient strings, sender strings, and system time/date strings such as `xtmonth`, `xtday`, `xtyear`, `xtshortdate`, `xtlongdate`) are summarized in [`function-index.md`](function-index.md) and used inline as personalization strings rather than called as functions.
