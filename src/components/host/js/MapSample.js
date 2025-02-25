import React , { useRef , useState } from 'react';
import { CFormInput } from '@coreui/react';
import axios from 'axios';

export default function MapSample({onAddressSelect, value, onChange}) {
    const [suggestions , setSuggestions] = useState ( [] );
    const debounceTimeout = useRef(null);

    const searchAddress = async (query) => {
        if (!query.trim() || query.length < 3) return setSuggestions([]);
        try {
            const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: { format: 'json', q: query, limit: 5, addressdetails: 1 },
                headers: { 'Accept': 'application/json' }
            });
            setSuggestions(
                data.map(item => ({
                    display_name: item.display_name,
                    lat: item.lat,
                    lon: item.lon,
                    address: item.address,
                    osm_id: item.osm_id,
                }))
            )
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    }

    const handleInputChange = (e) => {
        const value = e.target.value;
        onChange(value);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => searchAddress(value), 300);
    }; // only call API after user stops typing for 300ms

    const handleSelectAddress = (suggestion) => {
        onChange(suggestion.display_name);
        onAddressSelect({
            formattedAddress: suggestion.display_name,
            latitude: suggestion.lat,
            longitude: suggestion.lon,
            osmId: suggestion.osm_id,
            addressComponents: suggestion.address
        });
        setSuggestions([]);
    };

    return (
        <div style={{position: 'relative'}}>
            <CFormInput
                type="text"
                id="address"
                name="address"
                maxLength={500}
                value={value}
                onChange={handleInputChange}
                placeholder="Enter address"
                feedbackInvalid="Please enter an address"
                required
            />

            {suggestions.length > 0 && (
                <div style={{
                    position: 'absolute' ,
                    top: '100%' ,
                    left: 0 ,
                    right: 0 ,
                    backgroundColor: 'white' ,
                    border: '1px solid #ccc' ,
                    borderRadius: '4px' ,
                    marginTop: '4px' ,
                    maxHeight: '200px' ,
                    overflowY: 'auto' ,
                    zIndex: 1000
                }}>
                    {suggestions.map ( (suggestion ) => (
                        <div
                            key={suggestion.osm_id }
                            onClick={() => handleSelectAddress ( suggestion )}
                            style={{
                                padding: '8px 12px' ,
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f5f5f5';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                            }}
                        >
                            {suggestion.display_name}
                        </div>
                    ) )}
                </div>
            )}
        </div>
    );
}

