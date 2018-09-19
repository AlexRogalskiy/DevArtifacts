require 'spec_helper'

SYMBOLS = %i(dk se no de at ch pl fi es uk)

describe UrlDictionary do
  before :each do
    UrlDictionary::Config.use_local_dictionary!
  end

  context 'loading a dictionary' do
    it 'should load a dictionary instance for Denmark' do
      expect(UrlDictionary.load('dk'))
        .to be_an_instance_of(UrlDictionary::Dictionary)
    end

    it 'should be indifferent to case' do
      expect(UrlDictionary.load('Dk'))
        .to be_an_instance_of(UrlDictionary::Dictionary)
    end

    SYMBOLS.each do |symbol|
      it "should suppport the symbol :#{symbol} too" do
        expect(UrlDictionary.load(symbol))
          .to be_an_instance_of(UrlDictionary::Dictionary)
      end
    end
  end

  context 'reading keys' do
    let(:dictionary) { UrlDictionary.load('dk') }

    it 'raises MissingKeyError for absent keys' do
      expect(lambda do
        dictionary.t 'categories.kittens'
      end).to raise_error(UrlDictionary::MissingKeyError)
    end

    it 'raises BadValueError for keys pointing to a non-string value' do
      expect(lambda do
        dictionary.t 'categories'
      end).to raise_error(UrlDictionary::BadValueError)
    end

    it 'responds to translate in addition to t' do
      expect(dictionary.translate('sub_sites.sale'))
        .to eq('kob')
    end

    SYMBOLS.map(&:to_s).each do |site_key|
      it "supports all keys for #{site_key}" do
        dictionary = UrlDictionary.load(site_key)
        dictionary.t 'about_us'
        dictionary.t 'all'
        dictionary.t 'categories.investment_property'
        dictionary.t 'categories.user_property'
        dictionary.t 'categories.lot_property'
        dictionary.t 'categories.lease'
        dictionary.t 'energy_rating'
        dictionary.t 'error'
        dictionary.t 'find_business_locations'
        dictionary.t 'floor_plans'
        dictionary.t 'images'
        dictionary.t 'location.office'
        dictionary.t 'location.store'
        dictionary.t 'location.warehouse'
        dictionary.t 'location.location'
        dictionary.t 'newest'
        dictionary.t 'news'
        dictionary.t 'popular'
        dictionary.t 'property.office'
        dictionary.t 'property.store'
        dictionary.t 'property.warehouse'
        dictionary.t 'property.housing'
        dictionary.t 'prospect'
        dictionary.t 'providers'
        dictionary.t 'province'
        dictionary.t 'receipt'
        dictionary.t 'rent_out_business_locations'
        dictionary.t 'sell_business_locations'
        dictionary.t 'search_agent'
        dictionary.t 'services'
        dictionary.t 'sub_sites.lease'
        dictionary.t 'sub_sites.sale'
        dictionary.t 'video_presentation'
      end
    end
  end

  context 'remote fetching' do
    it 'works with fallback to local dictionary' do
      UrlDictionary::Config.use_remote_dictionary!

      expect(UrlDictionary.load('dk'))
        .to be_an_instance_of(UrlDictionary::Dictionary)
    end
  end
end
